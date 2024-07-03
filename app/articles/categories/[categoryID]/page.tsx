import { getArticlesByCategory, getCategoryList } from '@/libs/microcms';
import { generateSlug } from '@/libs/wanakana';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 静的生成のためのパラメータを生成
export async function generateStaticParams() {
  const { contents: categories } = await getCategoryList();
  return categories.map((category) => ({
    categoryID: category.categories,
  }));
}

export default async function CategoryPage({ params }: { params: { categoryID: string } }) {
  // カテゴリー一覧を取得し、該当するカテゴリーを探す
  const { contents: categories } = await getCategoryList();
  const category = categories.find((cat) => cat.categories === params.categoryID);

  if (!category) {
    notFound();
  }

  // カテゴリーに属する記事を取得
  const { contents: articles, totalCount } = await getArticlesByCategory(category.id);

  // 各記事のスラッグを生成
  const articlesWithSlugs = await Promise.all(
    articles.map(async (article) => ({
      ...article,
      slug: await generateSlug(article.title),
    }))
  );

  return (
    <div>
      <h1>{params.categoryID} の記事一覧</h1>
      <p>記事数: {totalCount}</p>
      {/* 記事一覧を表示 */}
      <ul>
        {articlesWithSlugs.map((article) => (
          <li key={article.id}>
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            <p>更新日: {new Date(article.updatedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
