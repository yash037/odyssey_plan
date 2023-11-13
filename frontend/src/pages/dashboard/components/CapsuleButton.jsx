
const CapsuleButton = ( { text , handler ,children} ) => {
    const buttonStyle = {
      backgroundColor: 'white',
      color: '#888',
      border: '2px solid black',
      borderRadius: '20px',
      padding: '10px 20px',
      cursor: 'pointer',
      display : 'flex',
      flexDirection : 'row',
      justifyContent : 'center',
      margin : '3px 0'
    };
    if(handler == null){
        handler = () => {}
    }
    return (
      <button style={ buttonStyle } onClick={handler}>
        {children}
        {text} 
      </button>
    );
  };

export default CapsuleButton