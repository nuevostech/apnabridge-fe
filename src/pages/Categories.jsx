import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../utils/api";
import { useData } from "../store/DataContext";

export default function Categories() {
  const { businesses } = useData()
  const [categories, setCategories] = useState([]);
  useEffect(() => {
  loadCategories();
}, []);

async function loadCategories() {
  try {
    const res = await getCategories();
    setCategories(res.data || []);
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
}
  return (
    <section className="section">
      <div className="section-head">
        <h1>Categories</h1>
        <p className="lede">Browse businesses by what they do.</p>
      </div>
      <div className="category-grid category-grid-full">
        {categories.map((c) => {
          const count = businesses.filter(
  (b) => b.category_slug === c.slug
).length;
          return (
            <Link key={c.id} to={`/businesses?category=${c.slug}`} className="category-chip">
              <span className="category-icon">{c.icon || "📂"}</span>
              <span>{c.name}</span>
              <span className="category-count">{count}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
