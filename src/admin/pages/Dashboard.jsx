const Dashboard = () => {

    const cards = [
        {
            title: "Total Businesses",
            value: 120
        },
        {
            title: "Approved",
            value: 85
        },
        {
            title: "Pending",
            value: 25
        },
        {
            title: "Testimonials",
            value: 48
        },
        {
            title: "Contacts",
            value: 19
        },
        {
            title: "Rejected",
            value: 10
        }
    ];

    return (

        <div className="cards">

            {cards.map((card) => (

                <div className="card" key={card.title}>

                    <h3>{card.title}</h3>

                    <h1>{card.value}</h1>

                </div>

            ))}

        </div>

    );

};

export default Dashboard;