import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Adminnav from "./Adminnav";
import { baseurl } from '../../Constent/regex';


interface CategoryState {
  name: string;
  image: File | null;
}

interface FetchedCategory {
  _id: string;
  categoryname: string;
  image: string;
  is_Listed: boolean;
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<FetchedCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryState>({
    name: "",
    image: null,
  });
  const [editCategory, setEditCategory] = useState<FetchedCategory | null>(null);

  const getCategories = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      });

      const response = await api.get("/admin/category");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      if (newCategory.image) formData.append("image", newCategory.image);

      const api = axios.create({
        baseURL: "http://localhost:3009/api",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      });

      const response = await api.post("/admin/add-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCategories(prevCategories => [...prevCategories, response.data]);
      setIsModalOpen(false);
      setNewCategory({ name: "", image: null });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      if (!editCategory) return;

      const formData = new FormData();
      formData.append("name", editCategory.categoryname);
      formData.append("id", editCategory._id);

      if (newCategory.image) {
        formData.append("image", newCategory.image);
      } else if (editCategory.image) {
        formData.append("image", editCategory.image);
      }

      const api = axios.create({
        baseURL: "http://localhost:3009/api",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      });

      const response = await api.put("/admin/edit-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category._id === editCategory._id ? response.data : category
          )
        );
        setIsModalOpen(false);
        setEditCategory(null);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        }
      }
    }
  };

  const handleListUnlist = async (categoryId: string, isListed: boolean) => {
    try {
      const api = axios.create({
        baseURL: "http://localhost:3009/api",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      });

      const response = await api.put(`/admin/categorylist`, { categoryId });
      if (response.status === 200) {
         console.log("response getting")
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category._id === categoryId
              ? { ...category, is_Listed: !category.is_Listed }
              : category
          )
        );
      } else {
        console.error("Failed to toggle category status. Response:", response);
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      await getCategories();
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const categoryToEdit = categories.find(category => category._id === categoryId);
    if (categoryToEdit) {
      setEditCategory({
        _id: categoryToEdit._id,
        categoryname: categoryToEdit.categoryname,
        image: categoryToEdit.image,
        is_Listed: categoryToEdit.is_Listed,
      });
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Adminnav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
          <Sidebar />

          <div
            className="flex-1 bg-white rounded-lg shadow-lg p-6 space-y-4"
            style={{
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-between items-center">
              <span className="text-lg font-semibold">Category List</span>
              <button
                className="bg-white hover:bg-blue-100 text-indigo-950 px-4 py-2 rounded-lg text-base font-medium"
                onClick={() => setIsModalOpen(true)}
              >
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="p-2 flex items-center shadow-md border rounded-lg"
                  style={{
                    height: "4rem",
                  }}
                >
                  <div className="flex items-center space-x-3 w-1/3">
                    <img
                      src={category.image}
                      alt={category.categoryname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-sm">{category.categoryname}</h3>
                    </div>
                  </div>

                  <div className="ml-auto flex space-x-2">
                    <button
                      className={`${
                        category.is_Listed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      } text-white px-4 py-2 rounded-lg text-sm font-medium`}
                      onClick={() => handleListUnlist(category._id, category.is_Listed)}
                    >
                      {category.is_Listed ? "Unlist" : "List"}
                    </button>
                    <button
                      className="bg-indigo-950 hover:bg-indigo-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() => handleEditCategory(category._id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full sm:w-96">
            <h3 className="text-lg font-semibold mb-4">{editCategory ? "Edit Category" : "Add New Category"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={editCategory?.categoryname || newCategory.name}
                  onChange={(e) =>
                    editCategory
                      ? setEditCategory({ ...editCategory, categoryname: e.target.value })
                      : setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category Image</label>
                <input
                  type="file"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      image: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={editCategory ? handleUpdateCategory : handleAddCategory}
                >
                  {editCategory ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;