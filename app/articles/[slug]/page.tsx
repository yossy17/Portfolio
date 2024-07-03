import { Inconsolata } from 'next/font/google';
import { getArticleDetail, getArticleList } from '@/libs/microcms';
import { generateSlug } from '@/libs/wanakana';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// import cheerio from 'cheerio';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark.min.css';

// Inconsolataフォントの設定
const inconsolata = Inconsolata({
  weight: ['400'],
  subsets: ['latin'],
  style: ['normal'],
});

// 静的生成のためのパラメータを生成
export async function generateStaticParams() {
  const { contents: articles } = await getArticleList({ fields: ['title'] });

  const slugs = await Promise.all(
    articles.map(async (article) => ({
      slug: await generateSlug(article.title),
    }))
  );

  return slugs;
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // 記事一覧を取得し、該当する記事を探す
  const { contents: articles } = await getArticleList();
  const article = await Promise.all(
    articles.map(async (a) => {
      const slug = await generateSlug(a.title);
      return slug === params.slug ? a : null;
    })
  ).then((results) => results.find((a) => a !== null));

  if (!article) {
    notFound();
  }

  // 記事の詳細を取得
  const fullArticle = await getArticleDetail(article.id);

  if (!fullArticle) {
    notFound();
  }

  // 記事の内容が有効かチェック
  if (!fullArticle.content || typeof fullArticle.content !== 'string') {
    console.error('Invalid article content:', fullArticle.content);
    return <div>記事の内容を読み込めませんでした。</div>;
  }

  // シンタックスハイライト処理（現在はコメントアウト）
  // try {
  //   const $ = cheerio.load(fullArticle.content);
  //   $('div[data-filename]').each((_, element) => {
  //     const filename = $(element).attr('data-filename');
  //     $(element).prepend(`<p>${filename}</p>`);
  //     $(element).addClass('Hoge');
  //     $(element).addClass(inconsolata.className);
  //   });
  //   $('pre code').each((_, element) => {
  //     const code = $(element).text();
  //     const highlightedCode = hljs.highlightAuto(code).value;
  //     $(element).html(highlightedCode);
  //     $(element).addClass('hljs');
  //     $(element).addClass(inconsolata.className);
  //   });
  //   fullArticle.content = $.html();
  // } catch (error) {
  //   console.error('Error processing article content:', error);
  // }

  return (
    <article>
      {/* サムネイル画像の表示 */}
      {fullArticle.thumbnail && (
        <Image
          src={fullArticle.thumbnail.url}
          alt={fullArticle.title}
          width={fullArticle.thumbnail.width}
          height={fullArticle.thumbnail.height}
        />
      )}
      <h1>{fullArticle.title}</h1>
      {/* カテゴリーの表示 */}
      <p>
        カテゴリー:
        {fullArticle.categories.map((category, index) => (
          <span key={category.id}>
            <Link href={`/articles/categories/${category.categories.toLowerCase()}`}>
              {category.categories}
            </Link>
            {index < fullArticle.categories.length - 1 && ', '}
          </span>
        ))}
      </p>
      <p>作成日: {new Date(fullArticle.createdAt).toLocaleDateString()}</p>
      <p>更新日: {new Date(fullArticle.updatedAt).toLocaleDateString()}</p>
      {/* 記事の内容を表示 */}
      <div dangerouslySetInnerHTML={{ __html: fullArticle.content }} />
    </article>
  );
}
