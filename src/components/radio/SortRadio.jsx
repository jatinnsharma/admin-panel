

const SortRadio = ({ label, value, selectedValue, onChange }) => (
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
      />
      {label}
    </label>
  );

export default SortRadio
  