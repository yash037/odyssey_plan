import {useRef, useState} from 'react';
import * as tus from 'tus-js-client'
 
 
export default function Upload({User}) {

    const [upload,setUpload]=useState(null);
    const [data,setData]=useState('no file selected');
    const inputRef=useRef(null);
    const pauseButtonRef=useRef(null);
    const resumeButtonRef=useRef(null);
    const googleid=User.googleId;
  
    function handleFileChange(){

        pauseButtonRef.current.disabled=false;
        resumeButtonRef.current.disabled=false; //enable button's when new file selected
        if(inputRef.current.files[0]!=null){
          setData(inputRef.current.files[0].name+' is selected'); //display that file is selected
        }
        setUpload (new tus.Upload(inputRef.current.files[0], {
            endpoint: "http://localhost:1080/storage/",
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: inputRef.current.files[0].name,
              filetype:inputRef.current.files[0].type,
              id:googleid,
            },
            urlStorage:true,
            chunkSize:100000,
            removeFingerprintOnSuccess:true,
            onError: function(error) {
              setData("Failed because: " + error) //display error
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                
                setData(percentage + '%');
              },
            onSuccess: function ( ) {
                
                pauseButtonRef.current.disabled=true;
                resumeButtonRef.current.disabled=true;
                console.log(upload)
                setData('Upload completed successfully \n select a new file to unlock resume and pause\n');
                
            },
            onAfterResponse : function () {

            }
        })
        )
         
  }


  function stopUpload(){
    if(upload!=null){
        upload.abort();
    }
  }


  function resumeUpload() {
        if(upload!=null){
        
            upload.findPreviousUploads().then(function (previousUploads) {
                console.log(previousUploads)
                if (previousUploads.length) {
                    upload.resumeFromPreviousUpload(previousUploads[0])
                }
            })
        }
        upload.start()
    }
   
  return (
    <div>
        <div className='display'>
          {data}
        </div>
        <input ref={inputRef} type="file" id="file" name="file" onChange={handleFileChange} />
        
        <button ref={resumeButtonRef} onClick={resumeUpload}>Resume</button>
        <button ref={pauseButtonRef} onClick={stopUpload}>Pause</button>
    </div>
  );
}