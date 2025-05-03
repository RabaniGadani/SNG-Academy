'use client';

import { useState } from 'react';

import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { createClient } from '@/lib/client';

interface AdmitCardData {
  Name: string;
  Father: string;
  City: string;
  Qualification: string;
  Course: string;
  Birth: number;
  CNIC: number;
  Picture: string;
  id: number;
  imageUrl: string;
}

const GenerateCard = () => {
  const [CNIC, setCNIC] = useState('');
  const [Name, setName] = useState('');
  const [admitData, setAdmitData] = useState<AdmitCardData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = Name.trim();
    const trimmedCNIC = CNIC.trim();

    if (!trimmedName || !trimmedCNIC) {
      setError('Both fields are required!');
      return;
    }

    if (trimmedCNIC.length !== 13) {
      setError('CNIC must be exactly 13 digits.');
      return;
    }

    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('Admission_Table')
      .select('*')
      .eq('CNIC', trimmedCNIC)
      .ilike('Name', `%${trimmedName}%`)
      .single();

    setLoading(false);

    if (error || !data) {
      toast.error('No record found.');
    } else {
      toast.success('Submitted Successfully');
      setAdmitData(data);
    }
  };

  const handlePrint = () => {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;

    const original = document.body.innerHTML;
    document.body.innerHTML = printArea.innerHTML;
    window.print();
    document.body.innerHTML = original;
  };

  return (
    <section>
      <br />
      <br />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {!admitData ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Download ID Card</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">CNIC:</label>
                  <input
                    type="text"
                    value={CNIC}
                    onChange={(e) => setCNIC(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter CNIC (13 digits)"
                    maxLength={13}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Full Name:</label>
                  <input
                    type="text"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter Full Name"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Generate ID Card'}
                </button>
              </form>
            </>
          ) : (
            <div id="print-area">
              <div className="mx-auto border w-[400px] h-[250px] rounded-md shadow-xl p-4 relative text-[12px]">
                {/* Header */}
                <div className="flex items-center justify-between relative z-20">
                  <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
                    <img src="/logo1.jpg" alt="Logo"  />
                  </div>
                  <h2 className="text-xs font-bold text-center text-black-800 w-full pr-6">
                    SHAHEED NASRULLAH GADANI ACADEMY
                    <p className="mt-1">STUDENT ID CARD</p>
                  </h2>
                </div>

                {/* Details and Picture */}
                <div className="flex mt-2 relative z-20">
                  <div className="w-2/3 pr-1">
                    <p><strong>Name:</strong> {admitData.Name}</p>
                    <p><strong>Father:</strong> {admitData.Father}</p>
                    <p><strong>CNIC:</strong> {admitData.CNIC}</p>
                    <p><strong>DOB:</strong> {new Date(admitData.Birth).toLocaleDateString()}</p>
                    <p><strong>Roll No:</strong> {admitData.id}</p>
                    <p><strong>Course:</strong> {admitData.Course}</p>
                  </div>
                  <div className="w-1/3 flex flex-col items-center justify-between relative z-20">
                    {admitData.Picture ? (
                      <div className="relative w-20 h-20 border rounded-sm overflow-hidden">
                        <img
                          src={admitData.Picture}
                          alt="Student"
                         
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 flex items-center justify-center rounded-sm text-xs">
                        No Photo
                      </div>
                    )}

                    {/* QR Code */}
                    <QRCodeCanvas
                      value={JSON.stringify({
                        id: admitData.id,
                        name: admitData.Name,
                        CNIC: admitData.CNIC
                      })}
                      size={40}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-6">
                  <div className="absolute bottom-2 right-2 z-30">
                    <div className="text-center">
                      <div className="h-6 border-b border-gray-500 w-28 mx-auto" />
                      <p className="text-[9px] text-gray-600">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Print ID Card
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GenerateCard;
