import { useEffect,useState } from "react";
import HomeNavbar from "../../components/HomeNavbar/HomeNavbar";
import { useSelector } from 'react-redux';
import { useLogoutMutation,useValidateUserStatusMutation } from "../../slices/api_slices/usersApiSlice";
import {toast} from "react-toastify"
import { useNavigate ,Navigate, Outlet} from "react-router-dom";
import {removeCredentials } from "../../slices/reducers/user_reducers/authSlice";
import {  useDispatch } from 'react-redux';
import HomeSkeleton from "../../components/ShimmerForHome/HomeSkeleton";
import Sidebar from '../../components/SideBar/SideBar'


const UserPrivateRoute  = ()=>{
    const userInfo  = useSelector((state) => state.auth.userInfo); 
    const [logOut,{isLoading}] = useLogoutMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [vaidateUser] = useValidateUserStatusMutation()
    const [status,setStatus] = useState(false)
   

    useEffect(()=>{
        vaidateUserStatus();
    },[status])

    const vaidateUserStatus = async ()=>{
        try {
            if(userInfo){
                const res = await vaidateUser({email:userInfo.email}).unwrap();
                console.log(res);
                if(res.isBlocked){
                    dispatch(removeCredentials());
                    setStatus(!status)
                    toast.error('you have been blocked by admin');
                    navigate('/')
                }
            }
            
        } catch (err) {
            toast.error(err.message)
        }
       
    }

    const logoutHandler =async ()=>{
        try {
              const res = await logOut()
            dispatch(removeCredentials())
             toast.success(res.data.message)
              navigate('/')           
            } catch (err) {
                toast.error(err.message)
            }
        }


    return (
       userInfo 
       ?(
        <>  
        <HomeNavbar userInfo={userInfo} logoutHandler={logoutHandler} isLoading={isLoading} />
        <Sidebar/>
        <Outlet/>
        </>
       )
       :(
          <Navigate to='/' replace />
       )
       
    )

}

export default UserPrivateRoute;