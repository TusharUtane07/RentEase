import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const formData = {
				email: email,
				password: password,
			};

			const response = await fetch("http://localhost:8000/api/v1/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				navigate("/");
			}
		} catch (error) {
			console.log("Error logging in", error);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen flex-col bg-[#35374B] text-white ">
			<div className="md:border-2 border-white/40 p-5  ">
				<div className="text-3xl text-center font-semibold uppercase ">
					<h1>Login</h1>
				</div>
				<div className=" md:px-5 md:py-3 ">
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col mt-2 ">
							<label htmlFor="">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-10 outline-none w-full pl-3 rounded-md mt-1 border-2 border-gray-500"
							/>
						</div>
						<div className="md:flex gap-3">
							<div className="flex flex-col mt-2">
								<label htmlFor="">Password</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="outline-none h-10 md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
						</div>

						<div className="mt-3">
							<button
								type="submit"
								className="bg-blue-500  text-white px-5 py-2 rounded-md w-full">
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
