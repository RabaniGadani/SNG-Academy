"use client";

import toast from 'react-hot-toast';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/client';

const AdmissionForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submittedCNIC, setSubmittedCNIC] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());

    const {
      Name,
      Father,
      Email,
      Number,
      CNIC,
      Birth,
      City,
      Course,
      Qaulification,
    } = formEntries;

    const { data: existingUser, error: userError } = await supabase
      .from("Admission_Table")
      .select("*")
      .eq("CNIC", CNIC);

    if (userError) {
      toast.error("Error checking existing user.");
      console.error(userError);
      setLoading(false);
      return;
    }

    if (existingUser && existingUser.length > 0) {
      toast.error("User with this CNIC already exists.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("Admission_Table").insert([
      {
        Name,
        Father,
        Email,
        Number,
        CNIC,
        Birth,
        City,
        Course,
        Qaulification,
      },
    ]);

    if (insertError) {
      toast.error("Form submission failed.");
      console.error(insertError);
    } else {
      toast.success("Form submitted successfully!");
      setSubmittedCNIC(CNIC as string);
    }

    setLoading(false);
  };

  return (
    <section>
      <br />
      <br />
      <br />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo1.jpg"
              alt="School Logo"
              width={90}
              height={70}
              className="rounded-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
            Admission Form
          </h2>

          {submittedCNIC ? (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-semibold">Your application has been submitted successfully!</p>
              <Link
                href="/main/generateCard"
                target="_blank"
                className="inline-block mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
              >
                Download Admit Card
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold">Full Name: *</label>
                  <input type="text" name="Name" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your full name" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Father&apos;s Name: *</label>
                  <input type="text" name="Father" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter father's name" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Email: *</label>
                  <input type="email" name="Email" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Phone Number: *</label>
                  <input type="tel" name="Number" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">CNIC / B-Form: *</label>
                  <input type="text" name="CNIC" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter CNIC number" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Date of Birth: *</label>
                  <input type="date" name="Birth" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">City: *</label>
                  <input type="text" name="City" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your city" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Course: *</label>
                  <select name="Course" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a course</option>
                    <option value="English Grammar">English Grammar</option>
                    <option value="Basic Science">Basic Science</option>
                    <option value="Basic Mathematics">Basic Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Qualification: *</label>
                  <input type="text" name="Qaulification" required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your qualification" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">Picture: *</label>
                  <input
                    type="file"
                    name="Picture"
                    required
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdmissionForm;
