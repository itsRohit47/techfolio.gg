export default function AddEducationDialog() {
    return (
        <div className="">
            <h2 className="text-sm font-bold">Add Education</h2>
            <div className="mt-4">
                <input type="file" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <input type="text" placeholder="Title" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <input type="text" placeholder="Subheading" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <input type="text" placeholder="Project Description" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <input type="text" placeholder="Project URL" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md">Add Project</button>
                </div>
            </div>
        </div>
    );
}