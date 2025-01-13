import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_Url } from '../../../config/BaseUrl';
import { toast } from 'sonner';
import { ArrowBack } from '@mui/icons-material';

const AddVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_city: "",
    vendor_address: "",
    vendor_category: "",
  });
  const [users, setUsers] = useState([
    {
      vendor_product_category_sub: "",
      vendor_product: "",
      vendor_product_size: "",
      vendor_product_rate: "0",
    },
  ]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [traderValue, setTraderValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const traderOptions = [
    { value: "1", label: "Live" },
    { value: "2", label: "Rates" },
    { value: "3", label: "Spot Rates" },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Base_Url}/panel-fetch-category`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategory(response.data.category);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (vendor.vendor_category) {
        try {
          const response = await axios.get(
            `${Base_Url}/panel-fetch-sub-category/${vendor.vendor_category}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSubCategory(response.data.categorySub);
        } catch (error) {
          toast.error("Failed to fetch subcategories");
        }
      }
    };

    fetchSubCategories();
  }, [vendor.vendor_category]);

  // Handle input change for vendor details
  const handleInputChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  // Handle input change for product details
  const handleUserChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  // Handle trader selection
  const handleTraderChange = (e) => {
    setTraderValue(e.target.value);
  };

  // Add more product fields
  const addItem = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        vendor_product_category_sub: "",
        vendor_product: "",
        vendor_product_size: "",
        vendor_product_rate: "0",
      },
    ]);
  };

  // Remove product fields
  const removeUser = (index) => {
    setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...vendor,
      vendor_no_of_products: users.length,
      vendor_trader: traderValue,
      vendorProduct_sub_data: users,
    };

    try {
      setIsButtonDisabled(true);
      setLoading(true);
      const response = await axios.post(
        `${Base_Url}/panel-create-vendor`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.code == 200) {
     

        navigate("/master/vendor");
        toast.success(response.data.msg || "Data inserted successfully");
      } else if (response.data.code == 403) {
        toast.error(response.data.msg || "Vendor Duplicate Entry.");
      } else if (response.data.code == 401) {
        toast.error(response.data.msg || "Email Duplicate Entry.");
      } else if (response.data.code == 402) {
        toast.error(response.data.msg || "Mobile Number Duplicate Entry.");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
         <div className="p-2 bg-gray-50 min-h-screen">
               {/* Header */}
               <div className="flex items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
                 <button
                   onClick={() => navigate("/master/vendor")}
                   className="text-gray-600 hover:text-gray-900 transition-colors"
                 >
                   <ArrowBack />
                 </button>
                 <h1 className="text-2xl font-semibold text-gray-800 ml-2">
                   Create Vendor 
                 </h1>
               </div>
       
               {/* Form */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full">
                 <form id="addVendorForm" autoComplete="off" onSubmit={onSubmit}>
                   <div className="space-y-4">
                     {/* Vendor Details */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Vendor Name <span className="text-red-700">*</span>
                         </label>
                         <input
                           type="text"
                           name="vendor_name"
                           value={vendor.vendor_name}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           placeholder="Enter Vendor Name"
                           required
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Mobile <span className="text-red-700">*</span>
                         </label>
                         <input
                           type="text"
                           name="vendor_mobile"
                           value={vendor.vendor_mobile}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           placeholder="Enter Mobile"
                           required
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Email <span className="text-red-700">*</span>
                         </label>
                         <input
                           type="email"
                           name="vendor_email"
                           value={vendor.vendor_email}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           placeholder="Enter Email"
                           required
                         />
                       </div>
                       <div className=" col-span-3">
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Address <span className="text-red-700">*</span>
                         </label>
                         <input
                           type="text"
                           name="vendor_address"
                           value={vendor.vendor_address}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           placeholder="Enter Address"
                           required
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           City <span className="text-red-700">*</span>
                         </label>
                         <input
                           type="text"
                           name="vendor_city"
                           value={vendor.vendor_city}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           placeholder="Enter City"
                           required
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Category <span className="text-red-700">*</span>
                         </label>
                         <select
                           name="vendor_category"
                           value={vendor.vendor_category}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           required
                         >
                           <option value="" disabled>
                             Select Category
                           </option>
                           {category.map((option) => (
                             <option key={option.id} value={option.category_name}>
                               {option.category_name}
                             </option>
                           ))}
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Trader <span className="text-red-700">*</span>
                         </label>
                         <select
                           value={traderValue}
                           onChange={handleTraderChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                           required
                         >
                           <option value="" disabled>
                             Select Trader
                           </option>
                           {traderOptions.map((option) => (
                             <option key={option.value} value={option.value}>
                               {option.label}
                             </option>
                           ))}
                         </select>
                       </div>
                     </div>
       
                     {/* Product Details */}
                     {users.map((user, index) => (
                       <div
                         key={index}
                         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                       >
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                             Sub Category <span className="text-red-700">*</span>
                           </label>
                           <select
                             name="vendor_product_category_sub"
                             value={user.vendor_product_category_sub}
                             onChange={(e) => handleUserChange(e, index)}
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                             required
                           >
                             <option value="" disabled>
                               Select Sub Category
                             </option>
                             {subcategory.map((option) => (
                               <option
                                 key={option.id}
                                 value={option.category_sub_name}
                               >
                                 {option.category_sub_name}
                               </option>
                             ))}
                           </select>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                             Product Name <span className="text-red-700">*</span>
                           </label>
                           <input
                             type="text"
                             name="vendor_product"
                             value={user.vendor_product}
                             onChange={(e) => handleUserChange(e, index)}
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                             placeholder="Enter Product Name"
                             required
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                             Size <span className="text-red-700">*</span>
                           </label>
                           <input
                             type="text"
                             name="vendor_product_size"
                             value={user.vendor_product_size}
                             onChange={(e) => handleUserChange(e, index)}
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                             placeholder="Enter Size"
                             required
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                             Rate <span className="text-red-700">*</span>
                           </label>
                           <input
                             type="number"
                             name="vendor_product_rate"
                             value={user.vendor_product_rate}
                             onChange={(e) => handleUserChange(e, index)}
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                             placeholder="Enter Rate"
                             required
                           />
                         </div>
                         <div className="flex items-end">
                           <button
                             type="button"
                             onClick={() => removeUser(index)}
                             className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                           >
                             Remove
                           </button>
                         </div>
                       </div>
                     ))}
       
                     {/* Add More Button */}
                     <div className="flex justify-start">
                       <button
                         type="button"
                         onClick={addItem}
                         className="px-6 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors"
                       >
                         Add More
                       </button>
                     </div>
                   </div>
       
                   {/* Buttons */}
                   <div className="flex justify-end mt-8 space-x-4">
                     <button
                       type="button"
                       onClick={() => navigate("/master/vendor")}
                       className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       disabled={isButtonDisabled}
                       className="px-6 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                       {loading ? "Submitting..." : "Submit"}
                     </button>
                   </div>
                 </form>
               </div>
             </div>
    </Layout>
  )
}

export default AddVendor