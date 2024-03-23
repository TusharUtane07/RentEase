import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [cPassword, setCPassword] = useState<string>("");
	const [profile, setprofile] = useState<any>(undefined); // Changed undefined to null

	const navigate = useNavigate();

	const handleprofileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Changed 'any' to 'React.ChangeEvent<HTMLInputElement>'
		const file = e.target.files && e.target.files[0]; // Access file object directly
		if (file) {
			setprofile(file);
		}
	};

	const [passwordMatch, setPasswordMatch] = useState(true);

	useEffect(() => {
		setPasswordMatch(password === cPassword || cPassword === "");
	}, [password, cPassword]); // Added dependencies to useEffect

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("email", email);
			formData.append("password", password);
			formData.append("cPassword", cPassword);
			if (profile) {
				formData.append("profile", profile);
			}

			const response = await fetch(
				"http://localhost:8000/api/v1/users/register",
				{
					method: "POST",
					body: formData,
				}
			);

			if (response.ok) {
				navigate("/login");
			}
		} catch (error) {
			console.log("Error in registering user", error);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen flex-col bg-[#35374B] text-white ">
			<div className="md:border-2 border-white/40 p-5  ">
				<div className="text-3xl text-center font-semibold uppercase ">
					<h1>Register</h1>
				</div>
				<div className=" md:px-5 md:py-3 ">
					<form onSubmit={handleFormSubmit}>
						<div className="md:flex gap-3">
							<div className="flex flex-col mt-2">
								<label htmlFor="">First name</label>
								<input
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="outline-none h-10 text-black  md:w-72  pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="">Last name</label>
								<input
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="outline-none h-10 text-black  md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
						</div>
						<div className="flex flex-col mt-2 ">
							<label htmlFor="">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-10 outline-none  text-black w-full pl-3 rounded-md mt-1 border-2 border-gray-500"
							/>
						</div>
						<div className="md:flex gap-3">
							<div className="flex flex-col mt-2">
								<label htmlFor="">Password</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="outline-none h-10 text-black  md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="">Confirm password</label>
								<input
									type="confirm password"
									value={cPassword}
									onChange={(e) => setCPassword(e.target.value)}
									className="outline-none h-10 text-black  md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
							{!passwordMatch && (
								<p className="text-red-500">Passwords not matching.</p>
							)}
						</div>
						<div className=" text-center my-4">
							<label htmlFor="profile" className="cursor-pointer">
								Upload profile picture
							</label>
							<input
								type="file"
								className="hidden"
								id="profile"
								onChange={handleprofileChange}
							/>
							{profile && (
								<img
									src={URL.createObjectURL(profile)}
									alt="profile-photo"
									className="w-40"
								/>
							)}
						</div>
						<div className="mt-3">
							<button
								type="submit"
								className="bg-blue-500  text-white px-5 py-2 rounded-md w-full"
								disabled={!passwordMatch}>
								Register
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
