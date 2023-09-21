import { Input,Button ,Textarea,Select,SelectItem,Image} from "@nextui-org/react"
import { useState,useEffect } from "react"
import { useUserGetInterestsMutation } from "../../slices/api_slices/usersApiSlice";
import { useStartStreamMutation } from "../../slices/api_slices/usersConferenceApi";
import {toast} from 'react-toastify'
import axios from "axios";



const StartStream = ()=>{

    const [interest,setInterest] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading,setLoading] = useState(false)
    const [streamData,setStreamData] = useState({
        title:'',
        desciption:'',
        interest:'',
        thumbnail:''
    })

    const [getInterest] = useUserGetInterestsMutation()
    const [startStream] = useStartStreamMutation()

    
   
    useEffect(()=>{
        getInterestHandler()
      },[])

      const getInterestHandler = async ()=>{
        try {
          const res = await getInterest().unwrap();
          setInterest(res.interests)
        } catch (error) {
          toast.error(error.data.message || error.message)
          
        }
      }

      const addProfileImageHandler = async ()=>{
        try {
            const formData = new FormData();
           formData.append("file",selectedImage);
           formData.append("upload_preset","reanconnect");
           const cloudRes = await axios.post("https://api.cloudinary.com/v1_1/dcv6mx1nk/image/upload",formData)
           console.log(cloudRes.data['public_id']);
          await setStreamData({
            ...streamData,
            thumbnail:cloudRes.data['public_id']
           })
        } catch (error) {
            toast.error(error?.message || error?.data?.message)
        }
      }

      async function streamHandler(){
        try {
            if(!streamData.title || !streamData.desciption || !streamData.interest) throw new Error("fill all fields")
            if(!selectedImage) throw new Error("please select a thumbnail for your stream")
            await addProfileImageHandler()
           const res = await startStream(streamData).unwrap()
           console.log(res);
           console.log(streamData,"stream dataaaaa");

        } catch (error) {
            console.log(error);
            toast.error(error?.message || error?.data?.message)
        }
      }



    return (
        <section className="h-screen">
            <div className="flex flex-col items-center m-12">
             <div className="m-2 ">
                <label>Title:</label>
                    <Input
                        placeholder='enter a title for your stream'
                        type="text"
                        name="title"
                        classNames="w-full"
                        isRequired
                        value={streamData.title}
                        onChange={(e)=>{
                            setStreamData({
                                ...streamData,
                                title:e.target.value
                            })
                        }}
                    />
             </div>
             <div className="m-2 ">
                <label>Description:</label>
                <Textarea
                    placeholder='enter a description for your stream'
                    name="description"
                    isRequired
                    value={streamData.desciption}
                    onChange={(e)=>{
                        setStreamData({
                            ...streamData,
                            desciption:e.target.value
                        })
                    }}
                />
             </div>
             <div className="m-2 ">
                <label>Interest:</label>
                <Select
                    isRequired
                    label='interests'
                    placeholder='select an interest'
                    classNames="w-full"
                    onChange={(e)=>{
                        setStreamData({
                            ...streamData,
                            interest:e.target.value
                        })
                    }}
                    name='interest'
                    >
                        {interest.map((value) => (
                        <SelectItem key={value.interest}  value={value.interest} className="w-fit">
                            {value.interest}
                        </SelectItem>
                        ))}
                    </Select>
              </div>
              <div className="m-2">
              <label className="cursor-pointer">
                 select a thumbnail :
                 </label>  
                    <Input
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
                    classNames="w-full"
                    placeholder="select a thumbnail"
                    name="thumbnail"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                     <Image
                            width={200}
                            alt="thumbnail"
                            name={'thumbnail'} src={
                                selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : undefined 
                            }
                            />
               
              </div>
              <div className="m-2">
                <Button 
                onClick={streamHandler}
                >
                    submit
                </Button>

              </div>
           </div>
        </section>
    )

}

export default StartStream