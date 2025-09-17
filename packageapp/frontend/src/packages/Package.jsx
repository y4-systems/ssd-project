import { useEffect, useState } from 'react';
import { Card } from "flowbite-react";

const Package = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/all-packages")
      .then(res => res.json())
      .then(data => setPackages(data));
  }, []);

  return (
    <div className='mt-28 px-4 lg:px24'>
      <h2 className='text-5xl font-bold text-center'>Our Packages</h2>

      <div className='grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1'>

        {
          packages.map(pkg => (
            <Card className="max-w-sm" key={pkg.id}>
            <img src={pkg.imageurl} alt={pkg.PackageName} className='h-96' />

            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {pkg.PackageName}
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-400">
              <p>
              {pkg.PackageDescription}
              </p>
            </p>
            <button className='bg-blue-700 font-semibold text-white' style={{ borderRadius: '10px',padding: '12px 24px'}}>GET A QUOTE</button>


          </Card>
        ))}

      </div>
    </div>
  );
};

export default Package;
