interface Props {
  label: string;
  accept?: string;
  onChange: (file: File) => void;
}

const FileUpload = ({ label, accept, onChange }: Props) => (
  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 cursor-pointer bg-white">
    <p className="text-sm text-slate-700">{label}</p>
    <p className="text-xs text-slate-500">Click to choose file</p>
    <input
      type="file"
      accept={accept}
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onChange(file);
      }}
    />
  </label>
);

export default FileUpload;
