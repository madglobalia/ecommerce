import ProductCard from "./ProductCard";

export default function FeaturedProducts() {

  const products = [
    {
      _id: "1",
      title: "iPhone 15",
      price: 1200,
      image: "https://picsum.photos/300/300",
    },

    {
      _id: "2",
      title: "Nike Shoes",
      price: 300,
      image: "https://picsum.photos/300/301",
    },

    {
      _id: "3",
      title: "MacBook",
      price: 2500,
      image: "https://picsum.photos/300/302",
    },

    {
      _id: "4",
      title: "Watch",
      price: 500,
      image: "https://picsum.photos/300/303",
    },
  ];

  return (
    <section className="p-10">

      <h2 className="text-4xl font-bold mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-4 gap-5">

        {products.map((product) => (

          <ProductCard
            key={product._id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

