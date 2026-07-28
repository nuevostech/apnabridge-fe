export const categories = [
  { slug: 'restaurants', name: 'Restaurants', icon: '🍽️' },
  { slug: 'grocery', name: 'Grocery', icon: '🛒' },
  { slug: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { slug: 'insurance', name: 'Insurance', icon: '🛡️' },
  { slug: 'healthcare', name: 'Healthcare', icon: '⚕️' },
  { slug: 'beauty-salon', name: 'Beauty & Salon', icon: '💇' },
  { slug: 'photography', name: 'Photography', icon: '📷' },
  { slug: 'digital-marketing', name: 'Digital Marketing', icon: '📣' },
  { slug: 'it-services', name: 'IT Services', icon: '💻' },
  { slug: 'education', name: 'Education', icon: '🎓' },
  { slug: 'logistics', name: 'Logistics', icon: '🚚' },
  { slug: 'construction', name: 'Construction', icon: '🏗️' },
  { slug: 'travel', name: 'Travel', icon: '✈️' },
  { slug: 'legal', name: 'Legal', icon: '⚖️' },
  { slug: 'fashion', name: 'Fashion', icon: '👗' },
  { slug: 'home-services', name: 'Home Services', icon: '🔧' },
  { slug: 'others', name: 'Others', icon: '✨' },
]

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug)
}
