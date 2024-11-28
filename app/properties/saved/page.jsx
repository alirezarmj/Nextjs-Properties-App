"use client";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch("/api/bookmarks");
        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          console.log(res.statusText);
          toast.error("Failed to fetch saved properties");
        }
      } catch (error) {
        toast.error("Failed to fetch saved properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedProperties();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <section className="px-4 py-6">
          <h1 className="text-2xl">Saved Properties</h1>
          {properties.length === 0 ? (
            <p>No saved properties found!</p>
          ) : (
            <div className="container-xl lg:container m-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default SavedPropertiesPage;
