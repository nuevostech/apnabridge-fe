const RESOURCE_GROUPS = [
  {
    title: 'Business Tips',
    items: [
      'How to write a business description that converts browsers into customers',
      'Pricing your services for both US and India markets',
      'Getting your first five reviews on ApnaBridge',
    ],
  },
  {
    title: 'Marketing Ideas',
    items: [
      'Running a WhatsApp-first promotion for a local audience',
      'Cross-promoting with other ApnaBridge businesses in your category',
      'Simple Instagram content ideas for service businesses',
    ],
  },
  {
    title: 'Success Stories',
    items: [
      'Saffron Spice Kitchen: from zero to fully booked catering calendar',
      'Bridge Realty Group: closing NRI clients through ApnaBridge search',
    ],
  },
  {
    title: 'Events',
    items: [
      'Community Business Mixer — every first Saturday, virtual',
      'ApnaBridge Vendor Fair — details announced in the WhatsApp community',
    ],
  },
]

export default function Resources() {
  return (
    <section className="section">
      <div className="section-head">
        <h1>Resources</h1>
        <p className="lede">Tips, ideas and stories to help your business grow.</p>
      </div>
      <div className="resource-grid">
        {RESOURCE_GROUPS.map((group) => (
          <div key={group.title} className="resource-card">
            <h2>{group.title}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
