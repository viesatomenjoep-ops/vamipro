import { createServiceClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminCategories() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  const parents = categories?.filter(c => !c.parent_id) || [];
  const getChildren = (parentId: string) => categories?.filter(c => c.parent_id === parentId) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Categorieën</h1></div>
        <Link href="/admin/categorieen/nieuw" className="btn btn-primary text-sm">Nieuwe categorie</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-fg-faint border-b hairline">
              <th className="p-4 font-normal">Naam</th>
              <th className="font-normal">Slug</th>
              <th className="font-normal">Soort</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {parents.map((p: any) => (
              <React.Fragment key={p.id}>
                {/* Parent */}
                <tr className="border-b hairline bg-bg/50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="text-fg-muted">{p.slug}</td>
                  <td className="text-fg-faint">Hoofdcategorie</td>
                  <td><Link href={`/admin/categorieen/${p.id}`} className="text-accent hover:underline">Bewerk</Link></td>
                </tr>
                {/* Children */}
                {getChildren(p.id).map((child: any) => (
                  <tr key={child.id} className="border-b hairline border-dashed">
                    <td className="p-4 pl-10 text-fg-muted flex items-center gap-2">
                      <div className="w-4 h-px bg-line-strong" />
                      {child.name}
                    </td>
                    <td className="text-fg-muted">{child.slug}</td>
                    <td className="text-fg-faint">Subcategorie</td>
                    <td><Link href={`/admin/categorieen/${child.id}`} className="text-accent hover:underline">Bewerk</Link></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {parents.length === 0 && (
          <div className="p-8 text-center text-fg-muted">Geen categorieën gevonden.</div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
