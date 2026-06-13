import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage?.content?.toLowerCase() || '';

    let responseText = "Ik ben de Vami Pro assistent! Hoe kan ik je helpen met onze car detailing producten?";
    let matched = false;

    // Keywords matching for FAQ
    if (userText.includes('verzend') || userText.includes('pakket') || userText.includes('bezorg') || userText.includes('kosten')) {
      responseText = "📦 **Verzending & Levering**\n\n- Bestellingen voor 16:00 uur worden dezelfde dag nog verzonden.\n- Levering in NL is doorgaans 1–2 werkdagen.\n- Verzendkosten zijn € 4,95 binnen NL.\n- Bij bestellingen vanaf € 75,- is verzending gratis!";
      matched = true;
    } else if (userText.includes('retour') || userText.includes('terugsturen') || userText.includes('bedenktijd')) {
      responseText = "🔄 **Retourneren**\n\nJe hebt 14 dagen bedenktijd op al onze producten, mits ongeopend en ongebruikt. Neem via de contactpagina contact met ons op om een retour aan te melden.";
      matched = true;
    } else if (userText.includes('contact') || userText.includes('bellen') || userText.includes('mail')) {
      responseText = "📞 **Contact**\n\nJe kunt ons bereiken via het contactformulier op de 'Contact' pagina. We proberen altijd binnen 24 uur te reageren op al je detailing vragen!";
      matched = true;
    } else if (userText.includes('hallo') || userText.includes('hoi') || userText.includes('goedendag')) {
      responseText = "Hallo! Welkom bij Vami Pro. Waar mag ik je vandaag mee helpen? Je kunt me vragen stellen over verzending, retourneren, of specifieke producten (bijv: 'wat kost de snow foam?' of 'welke velgenreiniger hebben jullie?').";
      matched = true;
    }

    // If not matched standard FAQ, query database for products
    if (!matched) {
      const supabase = createServiceClient();
      const { data: products } = await supabase.from('products').select('id, name, price_cents, slug, description').eq('is_active', true);
      
      const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

      let foundProducts: any[] = [];
      if (products) {
        for (const p of products) {
          const nameLower = p.name.toLowerCase();
          const descLower = p.description?.toLowerCase() || '';
          
          // Match logic
          // 1. Direct match of product name inside user question
          if (userText.includes(nameLower)) {
            foundProducts.push(p);
            continue;
          }

          // 2. Extract keywords from user and see if product matches
          const keywords = userText.split(/[ \?,.!]+/);
          const importantKeywords = keywords.filter(k => k.length > 3 && !['welke', 'hebben', 'jullie', 'voor', 'naar', 'zoeken', 'kost', 'prijs', 'duur', 'auto'].includes(k));
          
          for (const word of importantKeywords) {
            if (nameLower.includes(word) || descLower.includes(word)) {
              foundProducts.push(p);
              break;
            }
          }
        }
      }

      if (foundProducts.length > 0) {
        responseText = "Ik heb in onze database gezocht en het volgende gevonden voor je:\n\n";
        
        // Deduplicate and limit to top 3 matches
        const uniqueProducts = Array.from(new Map(foundProducts.map(p => [p.id, p])).values());
        
        uniqueProducts.slice(0, 3).forEach(p => {
           responseText += `- **${p.name}** kost ${euro(p.price_cents)}\n`;
        });
        
        if (uniqueProducts.length > 3) {
           responseText += `\nEn nog ${uniqueProducts.length - 3} andere producten! Ga naar 'Alle Producten' om alles te bekijken.`;
        } else {
           responseText += "\nKijk op onze productpagina om ze direct in je winkelmandje te plaatsen!";
        }
      } else {
        responseText = "Hmm, ik kan geen specifiek product vinden dat hierbij past in mijn database. Probeer een productnaam in te typen zoals 'Snow foam', 'Interior cleaner', of 'Velgenreiniger', of bekijk de volledige catalogus in het menu!";
      }
    }

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ content: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
