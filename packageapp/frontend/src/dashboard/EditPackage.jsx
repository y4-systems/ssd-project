import { useState } from "react";
import { useLoaderData } from 'react-router-dom';
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { useParams } from 'react-router-dom';

const EditPackage = () => {
  const { id } = useParams();
  const { PackageName, imageurl, PackageDescription, packageprice } = useLoaderData({ params: { id } });

  const packageCategories = [
    "Standard Package",
    "Promotion Package"
  ];

  const [selectedPackageCategory, setSelectedPackageCategory] = useState("Standard Package");
  const [priceError, setPriceError] = useState('');
  const [updatedPackagePrice, setUpdatedPackagePrice] = useState(packageprice);

  const handleChangeSelectedValue = (event) => {
    setSelectedPackageCategory(event.target.value);
  };

  const handleChangePackagePrice = (event) => {
    setUpdatedPackagePrice(event.target.value);
  };

  const validateImageUrl = (url) => {
    // Regular expression to validate URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const form = event.target;

    const updatedPackageName = form.PackageName.value;
    const updatedImageUrl = form.imageurl.value;
    const updatedPackageDescription = form.PackageDescription.value;

    // Additional validation
    if (!validateImageUrl(updatedImageUrl)) {
      alert('Please enter a valid image URL.');
      return;
    }

    // Validate price
    const price = parseFloat(updatedPackagePrice);
    if (isNaN(price) || price < 0 || !Number.isInteger(price)) {
      setPriceError('Please enter a valid price.');
      return;
    } else {
      setPriceError('');
    }

    const updatedPackageObj = {
      PackageName: updatedPackageName,
      imageurl: updatedImageUrl,
      PackageDescription: updatedPackageDescription,
      packageprice: updatedPackagePrice
    };

    fetch(`http://localhost:5000/Package/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPackageObj)
    })
    .then(res => res.json())
    .then(data => {
      alert("Package is updated successfully!");
    })
    .catch(error => {
      console.error('Error updating package:', error);
      alert('An error occurred while updating the package. Please try again later.');
    });
  };

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold' style={{marginTop:"40px"}}>Update Package Details</h2>
      <form onSubmit={handleUpdate} className="flex lg:w-[1180px] flex-col flex-wrap gap-4 ">

        {/* FIRST ROW */}
        {/*Package Name*/}
        <div className="flex gap-8">
          <div className="lg:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="PackageName" value="Package Name:" />
            </div>
            <TextInput id="PackageName" placeholder="Package name" required type="text" defaultValue={PackageName} />
          </div>

          {/*Package image*/}
          <div className="lg:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="imageurl" value="Package Image URL" />
            </div>
            <TextInput id="imageurl" type="text" placeholder="Package image Url" required defaultValue={imageurl} />
          </div>
        </div>

        {/* SECOND ROW */}
        {/*Description*/}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="PackageDescription" value="Package Description"/>
          </div>
          <Textarea id="PackageDescription" name="PackageDescription" placeholder="Enter package description" required className='w-full' rows={6} defaultValue={PackageDescription} />
        </div>

        {/*Category*/}
        <div className="flex gap-8">
          <div className="lg:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="inputState" value="Package Type" />
            </div>
            <select id='inputState' name='categoryName' className="w-full rounded" value={selectedPackageCategory} onChange={handleChangeSelectedValue}>
              {packageCategories.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          {/*Price*/}
          <div className='lg:w-1/2'>
            <div className='mb-2 block'>
              <Label htmlFor='packageprice' value='Package Price:' />
            </div>
            <TextInput id='packageprice' type='number' placeholder='Package price' required value={updatedPackagePrice} onChange={handleChangePackagePrice} />
            {priceError && <span className="text-red-500">{priceError}</span>}
          </div>
        </div>

        {/*Button*/}
        <Button type="submit" className="mt-5">
          Update Package
        </Button>
      </form>
    </div>
  );
};

export default EditPackage;
