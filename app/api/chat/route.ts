import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage?.content?.toLowerCase() || '';

    let responseText = "Ik ben de Vami Pro assistent! Hoe kan ik je helpen met onze car detailing producten?";

    // Keywords matching
    if (userText.includes('verzend') || userText.includes('pakket') || userText.includes('bezorg') || userText.includes('kosten')) {
      responseText = "📦 **Verzending & Levering**\n\n- Bestellingen voor 16:00 uur worden dezelfde dag nog verzonden.\n- Levering in NL is doorgaans 1–2 werkdagen.\n- Verzendkosten zijn € 4,95 binnen NL.\n- Bij bestellingen vanaf € 75,- is verzending gratis!";
    } else if (userText.includes('retour') || userText.includes('terugsturen') || userText.includes('bedenktijd')) {
      responseText = "🔄 **Retourneren**\n\nJe hebt 14 dagen bedenktijd op al onze producten, mits ongeopend en ongebruikt. Neem via de contactpagina contact met ons op om een retour aan te melden.";
    } else if (userText.includes('interieur') || userText.includes('binnen')) {
      responseText = "✨ **Interieurproducten**\n\nVoor het interieur raden we onze Vami Pro Interior Cleaner aan. Veilig te gebruiken op dashboard, kunststof, leer en bekleding. Het laat geen vettige laag achter en heeft een frisse geur.";
    } else if (userText.includes('exterieur') || userText.includes('buiten') || userText.includes('lak') || userText.includes('coating')) {
      responseText = "🚗 **Exterieur & Coatings**\n\nWe hebben een breed assortiment voor de buitenkant, van veilige shampoos tot keramische coatings (9H hardheid). Voor de beste glans raden we aan om na het wassen een coating te overwegen voor jarenlange bescherming.";
    } else if (userText.includes('droogdoek') || userText.includes('doek') || userText.includes('microvezel')) {
      responseText = "🧼 **Droogdoeken & Microvezel**\n\nOnze droogdoeken (zoals de Twisted Loop doeken) nemen enorm veel water op zonder te krassen. Was ze altijd zonder wasverzachter om hun zuigkracht te behouden!";
    } else if (userText.includes('handschoen') || userText.includes('wassen') || userText.includes('spons')) {
      responseText = "🧤 **Washandschoenen**\n\nGebruik nooit een gewone spons! Onze microvezel washandschoenen nemen het vuil veilig op, diep in de vezels, zodat je de lak niet bekrast tijdens het wassen.";
    } else if (userText.includes('contact') || userText.includes('bellen') || userText.includes('mail')) {
      responseText = "📞 **Contact**\n\nJe kunt ons bereiken via het contactformulier op de 'Contact' pagina. We proberen altijd binnen 24 uur te reageren op al je detailing vragen!";
    } else if (userText.includes('hallo') || userText.includes('hoi') || userText.includes('goedendag')) {
      responseText = "Hallo! Welkom bij Vami Pro. Waar mag ik je vandaag mee helpen? Je kunt me vragen stellen over verzending, retourneren, of specifieke producten voor je auto.";
    }

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ content: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
