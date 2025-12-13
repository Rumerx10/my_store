import { createSlice } from '@reduxjs/toolkit';


interface IWishlistItem{
  id:string, 
  name:string, 
  img:string,
  rating:number,
  
}



const initialState={
  items:[]
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: () => {},
    removeFromWishlist: () => {},
  },
});
