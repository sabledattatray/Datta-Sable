import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { customer } from '@/lib/commerce/access';
import { assertCheckout } from '@/lib/commerce/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailClient from '@/components/commerce/ProductDetailClient';
import { productDetailsMap } from '@/lib/commerce/product-settings';
import { defaultProductDetails, productReadiness, resourceFormatLabel, safeJsonLd } from '@/lib/commerce/product-details';
import styles from '@/components/commerce/ProductDetail.module.css';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
const loadProduct = cache(async (slug: string) => {
  const product = await prisma.commerceProduct.findUnique({where:{slug},include:{ebook:true,resources:{where:{active:true},select:{id:true,title:true,pathname:true}}}});
  if (!product) return null;
  if (product.ebook) { if (product.status !== 'PUBLISHED' || process.env.EBOOK_STORE_ENABLED !== 'true') return null; permanentRedirect('/ebooks/' + product.slug); }
  if (product.status !== 'PUBLISHED') { try { await customer(true); } catch { return null; } }
  const details = (await productDetailsMap([product.id])).get(product.id) || defaultProductDetails();
  return {product,details,readiness:productReadiness(product,details)};
});
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const data=await loadProduct((await params).slug);
  if(!data)return {title:'Resource unavailable',robots:{index:false,follow:false}};
  const {product:p,readiness}=data,title=p.seoTitle||p.title,description=p.seoDescription||p.excerpt,url='https://dattasable.com/products/'+p.slug;
  return {title,description,alternates:{canonical:url},robots:{index:p.status==='PUBLISHED'&&readiness==='READY_FOR_SALE',follow:true},openGraph:{title,description,url,type:'website',images:[{url:'/products/opengraph-image',width:1200,height:630,alt:'Datta Sable digital resources'}]},twitter:{card:'summary_large_image',title,description,images:['/products/opengraph-image']}};
}
export default async function ProductPage({params}:Props){
  const data=await loadProduct((await params).slug);if(!data)notFound();const {product:p,details,readiness}=data;
  let configured=true;try{assertCheckout();}catch{configured=false;}
  const topics=details.technologies.length?details.technologies:[p.category];
  const relatedPosts=await prisma.post.findMany({where:{published:true,OR:topics.slice(0,8).flatMap(t=>[{title:{contains:t,mode:'insensitive' as const}},{category:{contains:t,mode:'insensitive' as const}}])},select:{slug:true,title:true},take:3,orderBy:{createdAt:'desc'}}).catch(()=>[]);
  const url='https://dattasable.com/products/'+p.slug;
  const jsonLd={'@context':'https://schema.org','@graph':[
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://dattasable.com'},{'@type':'ListItem',position:2,name:'Digital products',item:'https://dattasable.com/products'},{'@type':'ListItem',position:3,name:p.title,item:url}]},
    ...(readiness==='READY_FOR_SALE'?[{'@type':'Product',name:p.title,description:p.excerpt,url,...(p.image?{image:p.image}:{}),brand:{'@type':'Brand',name:'Datta Sable'}}]:[]),
  ]};
  return <><Navbar/><main className={styles.pageWrapper}><div className={styles.container}><nav className={styles.topNav} aria-label="Breadcrumb"><div className={styles.breadcrumbs}><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/products">Digital products</Link><span aria-hidden="true">/</span><span className={styles.current} aria-current="page">{p.title}</span></div><div className={styles.accountLinks}><Link href="/account/orders">My Orders</Link><Link href="/account/purchases">My Purchases</Link></div></nav>
    {p.status!=='PUBLISHED'&&<p role="note">Administrator preview · {p.status} · hidden from public catalog.</p>}
    <ProductDetailClient product={{id:p.id,slug:p.slug,title:p.title,excerpt:p.excerpt,description:p.description,category:p.category,image:p.image,priceMinor:p.priceMinor,currency:p.currency,status:p.status,salesEnabled:p.salesEnabled,deliveryReady:p.deliveryReady,features:p.features,includedResources:p.includedResources,resources:p.resources.map(r=>({id:r.id,title:r.title,format:resourceFormatLabel(r.pathname)})),details,readiness,updatedAt:p.updatedAt.toISOString()}} isConfigured={configured}/>
    {relatedPosts.length>0&&<section className={styles.infoBlock}><h2>Learn before you buy</h2><p>Free published articles, separate from purchased deliverables.</p><ul>{relatedPosts.map(post=><li key={post.slug}><Link href={'/blog/'+post.slug}>{post.title}</Link></li>)}</ul></section>}
  </div></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(jsonLd)}}/></>;
}
