
const CapsuleButton = ( { text , handler ,children} ) => {
    const buttonStyle = {
      backgroundColor: 'white',
      color: '#888',
      border: '2px solid black',
      borderRadius: '20px',
      padding: '10px 20px',
      cursor: 'pointer',
    };
    if(handler == null){
        handler = () => {}
    }
    return (
      <button style={buttonStyle} onClick={handler}>
        {text} 
        {children}
      </button>
    );
  };

export default CapsuleButton