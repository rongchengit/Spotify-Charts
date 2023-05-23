import { placeholderCSS } from "react-select/dist/declarations/src/components/Placeholder";

export const customStyles = {
    control: (provided: any) => ({
      ...provided,
      color:'#5A5A5A',
      backgroundColor: '#1DB954',
      borderColor: 'transparent',
      borderRadius: '25px',
      fontFamily: 'Gotham Rounded, sans-serif',
      fontSize: '24px',
      width: '100%', // use percentage width
      maxWidth: '500px', // limit maximum width
      display: 'flex',
      justifyContent: 'center', // Center the text
      margin: '0 auto', // Center the dropdown menu on the page
      textAlign: 'center',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
      ? '#1DB954'
      : state.isFocused
      ? '#1DB954'
      : state.isActive
      ? '#1DB954'
      : '#191414',
      color: '#5A5A5A',
      fontFamily: 'Gotham Rounded, sans-serif',
      fontSize: '24px',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#191414',
      overflow: 'hidden',
      position: 'relative',
      width: '100%', // use percentage width
      maxWidth: '500px', // limit maximum width
      margin: '0 auto', // Center the dropdown menu on the page
      textAlign: 'center',
    }),
    menuList: (provided: any) => ({
      ...provided,
      '&::-webkit-scrollbar': {
        width: '10px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#5A5A5A',
    }),
    placeholder: (provided: any) =>({
      ...provided,
      color: '#5A5A5A'
    })
  };