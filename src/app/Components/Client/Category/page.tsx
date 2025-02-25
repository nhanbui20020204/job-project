import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Design", jobs: 235, icon: "🎨" },
  { name: "Sales", jobs: 756, icon: "📊" },
  { name: "Marketing", jobs: 140, icon: "📢" },
  { name: "Finance", jobs: 325, icon: "💰" },
  { name: "Technology", jobs: 436, icon: "💻" },
  { name: "Engineering", jobs: 542, icon: "⚙️" },
  { name: "Business", jobs: 211, icon: "💼" },
  { name: "Human Resource", jobs: 346, icon: "👥" },
];

export default function ExploreByCategory() {
  return (
    <section className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center md:text-left">
          Explore by <span className="text-blue-500">category</span>
        </h2>
        <a href="#" className="text-blue-500 flex items-center font-semibold mt-4 md:mt-0">
          Show all jobs <ArrowRight className="ml-1" size={16} />
        </a>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="p-4 rounded-xl bg-gray-200 border shadow-md flex flex-col gap-3 transition 
            hover:bg-gray-300 hover:text-black hover:shadow-lg transform hover:scale-105 cursor-pointer"
          >
            <span className="text-4xl">{category.icon}</span>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-500 hover:text-white">{category.jobs} jobs available</p>
            <div className="flex justify-end">
              <ArrowRight className="w-5 h-5 text-gray-500 hover:text-black transition" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
