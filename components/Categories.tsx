export default function Categories() {
  const categories = [
    "Electronics",
    "Fashion",
    "Shoes",
    "Mobiles",
  ];

  return (
    <section className="p-10">

      <h2 className="text-4xl font-bold mb-10">
        Categories
      </h2>

      <div className="grid grid-cols-4 gap-5">

        {categories.map((category) => (

          <div
            key={category}
            className="bg-gray-200 p-10 text-center rounded text-2xl font-bold"
          >
            {category}
          </div>

        ))}

      </div>

    </section>
  );
}