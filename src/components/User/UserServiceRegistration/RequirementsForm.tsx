import React from "react";

interface RequirementsFormProps {
  formData: {
    name: string;
    discription: string;
    files: File[];
  };
  formErrors: {
    name: string;
    discription: string;
  };
  onFormChange: (field: string, value: string) => void;
  onFileChange: (files: File[]) => void;
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({
  formData,
  formErrors,
  onFormChange,
  onFileChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFileChange(files);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Service Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., AC Repair for Living Room"
        />
        {formErrors.name && (
          <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.discription}
          onChange={(e) => onFormChange("discription", e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your service requirements in detail..."
        />
        {formErrors.discription && (
          <p className="text-red-500 text-sm mt-1">{formErrors.discription}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Images (Optional)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {formData.files.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {formData.files.length} file(s) selected
          </p>
        )}
      </div>
    </div>
  );
};

export default RequirementsForm;