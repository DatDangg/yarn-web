import { Formik, Form } from "formik"
import { useAuth } from "../../contexts/AuthContext"
import FloatingInputField from "./FloatingInputField"
import { useRef, useState } from "react"
import axios from "axios"
import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { useTranslation } from "react-i18next"

function Profile() {
    const { user, update } = useAuth()
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const API = process.env.REACT_APP_API_URL
    const [day, month, year] = user?.birthday?.split("-") || ["", "", ""];

    const initialValues = {
        fullname: user?.fullname || "",
        phonenumber: user?.phonenumber || "",
        email: user?.email || "",
        username: user?.username || "",
        avatar: user?.avatar || "",
        day,
        month,
        year,
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            const imageUrl = data.secure_url;

            setFieldValue("avatar", imageUrl);

            if (user) {
                user.avatar = imageUrl;
            }

        } catch (err) {
            console.error("Image upload failed:", err);
        }
    };


    const handleSubmit = async (values: any) => {
        try {
            const { day, month, year, username, avatar, ...rest } = values;
            const birthday = `${day}-${month}-${year}`;

            const payload = {
                ...rest,
                avatar,
                birthday,
            };

            await axios.patch(`${API}/users/${user?.id}`, {
                ...payload
            })

            update()

        } catch (err) {
            console.log(err)
        }
    };


    return (
        <div className="mb-[24px]">
            <div className="container">
                <div className="text-[24px] font-[600] capitalize">{t('profile1')}</div>
                <div className="mb-[22px] text-[18px] text-[var(--text-color)]">{t('profile2')}</div>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ setFieldValue }) => (

                        <Form className="grid grid-cols-2 md:grid-cols-[300px_1fr] gap-6 items-start">
                            {user?.avatar ?
                                <div className="relative w-[200px] h-[200px] rounded-[5px] bg-gray-200">
                                    <img
                                        src={user.avatar}
                                        alt="Avatar"
                                        className="object-cover w-full h-full border border-black rounded-[5px]"
                                    />

                                    <button
                                        type="button"
                                        className="flex justify-center items-center absolute bottom-[-8px] right-[-8px] w-[30px] h-[30px] bg-[var(--active-color)] border-[3px] border-white p-1 rounded-full text-white text-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path
                                                fill="white"
                                                d="M18.414 2c-.256 0-.512.098-.707.293L16 4l4 4 1.707-1.707a1 1 0 0 0 0-1.414l-2.586-2.586A.996.996 0 0 0 18.414 2zM14.5 5.5L3 17v4h4L18.5 9.5 14.5 5.5z"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={(e) => handleImageChange(e, setFieldValue)}
                                        className="hidden"
                                    />
                                </div>

                                :
                                <div className="relative w-[200px] h-[200px]">

                                    <Avatar icon={<UserOutlined />} size={226} />
                                    <button
                                        type="button"
                                        className="flex justify-center items-center absolute bottom-[-8px] right-[-8px] w-[30px] h-[30px] bg-[var(--active-color)] border-[3px] border-white p-1 rounded-full text-white text-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path
                                                fill="white"
                                                d="M18.414 2c-.256 0-.512.098-.707.293L16 4l4 4 1.707-1.707a1 1 0 0 0 0-1.414l-2.586-2.586A.996.996 0 0 0 18.414 2zM14.5 5.5L3 17v4h4L18.5 9.5 14.5 5.5z"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={(e) => handleImageChange(e, setFieldValue)}
                                        className="hidden"
                                    />
                                </div>
                            }
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                    <FloatingInputField value="username" disabled label={`${t('ifield1')}`} />
                                    <FloatingInputField value="fullname" label={`${t('ifield2')}`} />
                                    <FloatingInputField value="phonenumber" label={`${t('ifield3')}`} />
                                    <FloatingInputField value="email" label={`${t('ifield4')}`} />

                                    {/* New Birthday Fields */}
                                </div>
                                <div className="mt-8 text-[18px] font-[family-name:var(--font-Gentium)]">Date of Birth</div>
                                <div className="flex mt-2 gap-x-8">
                                    <FloatingInputField value="day" label={`${t('ifield5')}`} />
                                    <FloatingInputField value="month" label={`${t('ifield6')}`} />
                                    <FloatingInputField value="year" label={`${t('ifield7')}`} />

                                </div>
                                <button
                                    type="submit"
                                    className={`px-6 py-2 mt-10 rounded text-white bg-black hover:bg-gray-800`}
                                >
                                    {t('profile3')}
                                </button>
                            </div>
                        </Form>
                    )}

                </Formik>
                <div>
                </div>
            </div>
        </div>
    )
}

export default Profile

