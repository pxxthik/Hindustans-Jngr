"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ImageUpload from "@components/ImageUpload";
import Image from "next/image";

function page() {
  const [post, setPost] = useState({ alt_text: "", image: "" });
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("Add");

  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/slider", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await response.json();
      data.reverse();
      setImages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const response = await fetch("/api/slider/add", {
      method: "POST",
      body: JSON.stringify({
        image: post.image,
        alt_text: post.alt_text,
      }),
    });
    if (response.ok) {
      setSubmitting(false);
      alert("Image uploaded successfully");
      fetchImages();
    }
  };

  const handleDelete = async (id) => {
    const hasConfirmed = confirm("Are you sure you want to delete this image?");
    if (hasConfirmed) {
      const response = await fetch(`/api/slider/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchImages();
      }
    }
  };
  return (
    <div>
      <p className="my-8 desc text-left max-w-md">
        Toggle Featured Image Here. This is the slider shown in Home page of{" "}
        <b>Hindsutan's Jngr</b>.
      </p>
      <label htmlFor="">
        <span className="font-satoshi font-semibold text-base text-gray-700">
          Image
        </span>
        <br />
        <ImageUpload setPost={setPost} post={post} />
      </label>
      <br />
      <label htmlFor="">
        <span className="my-5 font-satoshi font-semibold text-base text-gray-700">
          Alt text
        </span>
        <input
          value={post.alt_text}
          onChange={(e) => setPost({ ...post, alt_text: e.target.value })}
          placeholder="alt text"
          required
          className="form_input"
        />
      </label>
      <div className="flex-end my-8 mx-3 mb-5 gap-4">
        <Link href="/" className="text-gray-500 text-sm">
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-1.5 rounded-full text-sm bg-primary-orange text-white border-none"
        >
          {submitting ? `${type}...` : type}
        </button>
      </div>

      <div className="mt-16">
        {images.map((image) => (
          <div className="my-16">
            {image.image_url && (
              <Image
                src={image.image_url}
                alt="Feature Image"
                width={500}
                height={500}
              />
            )}

            <button
              className="my-4 px-5 py-1.5 rounded-full text-sm bg-primary-orange text-white border-none"
              onClick={() => handleDelete(image._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
