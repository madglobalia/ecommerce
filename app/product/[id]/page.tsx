import axios from "axios";

async function getProduct(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function ProductDetails({
  params,
}: any) {
  const product = await getProduct(params.id);

  return (
    <div className="p-10 grid grid-cols-2 gap-10">
      <img
        src={product.image}
        className="w-full h-[500px] object-cover"
      />

      <div>
        <h1 className="text-4xl font-bold">
          {product.title}
        </h1>

        <p className="mt-5">{product.description}</p>

        <p className="text-2xl mt-5">
          ₹{product.price}
        </p>

        <button className="bg-black text-white px-6 py-3 mt-5">
          Proceed Checkout
        </button>
      </div>
    </div>
  );
}