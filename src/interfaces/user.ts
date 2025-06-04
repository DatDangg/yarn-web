export interface UserProps {
  id: number,
  username: string,
  token?: string
}

export interface Shipping {
  id: number,
  state?: string,
  address: string,
  phonenumber: string
  receiver: string
}

export interface UserInforProps {
  id: number,
  username: string,
  avatar: string,
  fullname: string,
  address: string
  phonenumber: string,
  shippingInfor: Shipping[],
  birthday?: string,
  email?: string
}