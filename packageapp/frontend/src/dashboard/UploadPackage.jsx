import { useState } from 'react';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';

const UploadPackage = () => {

  <div className='h-screen'></div>
  const packageCategories = ['Standard Package', 'Promotion Package'];
  const [selectedPackageCategory, setSelectedPackageCategory] = useState(packageCategories[0]);
  const [priceError, setPriceError] = useState('');

  const handleChangeSelectedValue = (event) => {
    setSelectedPackageCategory(event.target.value);
  };

  const handlePackageSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const PackageName = form.PackageName.value;
    const imageurl = form.imageurl.value;
    const PackageDescription = form.PackageDescription.value;
    const category = form.category.value;
    const packageprice = form.packageprice.value;

    const packageObj = {
      PackageName,
      imageurl,
      PackageDescription,
      category,
      packageprice
    };

    // Additional validation
    if (!validateImageUrl(imageurl)) {
      alert('Please enter a valid image URL.');
      return;
    }

    // Validate price
    const price = parseFloat(packageprice);
    if (isNaN(price) || price < 0 || !Number.isInteger(price)) {
      setPriceError('Please Enter Valid Price');
      return;
    } else {
      setPriceError('');
    }

    console.log(packageObj);

    //send data to the database
    fetch('http://localhost:5000/upload-Package', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(packageObj)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert('Package uploaded Successfully');
        form.reset();
      });
  };

  const validateImageUrl = (url) => {
    // Regular expression to validate URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold' style={{ marginTop: '40px' }}>Upload A Package</h2>

      <form onSubmit={handlePackageSubmit} className='flex lg:w-[1180px] flex-col flex-wrap gap-4 '>

        {/*First row*/}
        <div className='flex gap-8'>
          <div className='lg:w-1/2'>
            <div className='mb-2 block'>
              <Label htmlFor='PackageName' value='Package Name:' />
            </div>
            <TextInput id='PackageName' type='text' placeholder='Package name' required />
          </div>

          {/*image*/}
          <div className='lg:w-1/2'>
            <div className='mb-2 block'>
              <Label htmlFor='imageurl' value='Package Image URL' />
            </div>
            <TextInput id='imageurl' type='url' placeholder='Package image Url' required />
          </div>
        </div>

        {/*Second row*/}

        {/*Book Description*/}
        <div>
          <div className='mb-2 block'>
            <Label htmlFor='PackageDescription' value='Package Description' />
          </div>
          <Textarea id='PackageDescription' name='PackageDescription' placeholder='Enter package description' required className='w-full' rows={6} />
        </div>

        {/*Third Row*/}

        {/*Category*/}
        <div className='flex gap-8'>
          <div className='lg:w-1/2'>
            <div className='mb-2 block'>
              <Label htmlFor='inputState' value='Package Type' />
            </div>

            <select
              id='inputState'
              name='category'
              className='w-full rounded'
              value={selectedPackageCategory}
              onChange={handleChangeSelectedValue}>
              {packageCategories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/*price*/}
          <div className='lg:w-1/2'>
            <div className='mb-2 block'>
              <Label htmlFor='packageprice' value='Package Price:' />
            </div>
            <TextInput id='packageprice' type='number' placeholder='Package price' required />
            {priceError && <span className="text-red-500">{priceError}</span>}
          </div>
        </div>

        <Button type='submit' className='mt-5'>
          Upload Package
        </Button>
      </form>
    </div>
  );
};

export default UploadPackage;
