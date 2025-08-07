import React, { useState, useEffect } from 'react';
import { postsAPI } from '../../api/posts'; // Adjust path as needed
import { X } from 'lucide-react';

const TagInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Fetch all available tags when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await postsAPI.getTags();
        setAllTags(tagsData.map(tag => tag.name));
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Handle changes to the input field
  const handleInputChange = (e) => {
    const currentInput = e.target.value;
    setInputValue(currentInput);

    if (currentInput) {
      const filtered = allTags.filter(
        tag => tag.toLowerCase().includes(currentInput.toLowerCase()) && !value.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Add a tag to the list
  const addTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  // Remove a tag from the list
  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  // Handle key presses, specifically "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      addTag(inputValue);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
        {value.map((tag) => (
          <span key={tag} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-1 px-2.5 py-0.5 rounded-full">
            {tag}
            <button
              type="button"
              className="ml-1.5 text-blue-500 hover:text-blue-700"
              onClick={() => removeTag(tag)}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent outline-none text-sm py-1"
          placeholder="Add a tag..."
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;