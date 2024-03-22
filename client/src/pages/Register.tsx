const Register = () => {
	return (
		<div className="flex items-center justify-center h-screen flex-col bg-[#35374B] text-white ">
			<div className="md:border-2 border-white/40 p-5  ">
				<div className="text-3xl text-center font-semibold uppercase ">
					<h1>Register</h1>
				</div>
				<div className=" md:px-5 md:py-3 ">
					<form>
						<div className="md:flex gap-3">
							<div className="flex flex-col mt-2">
								<label htmlFor="">First name</label>
								<input
									type="text"
									className="outline-none h-10 md:w-72  pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="">Last name</label>
								<input
									type="text"
									className="outline-none h-10 md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
						</div>
						<div className="flex flex-col mt-2 ">
							<label htmlFor="">Email</label>
							<input
								type="email"
								className="h-10 outline-none w-full pl-3 rounded-md mt-1 border-2 border-gray-500"
							/>
						</div>
						<div className="md:flex gap-3">
							<div className="flex flex-col mt-2">
								<label htmlFor="">Password</label>
								<input
									type="password"
									className="outline-none h-10 md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
							<div className="flex flex-col mt-2">
								<label htmlFor="">Confirm password</label>
								<input
									type="confirm password"
									className="outline-none h-10 md:w-72 pl-3 rounded-md mt-1 border-2 border-gray-500"
								/>
							</div>
						</div>
						<div className=" text-center my-4">
							<label htmlFor="profile" className="cursor-pointer">
								Upload profile picture
							</label>
							<input type="file" className="hidden" id="profile" />
						</div>
						<div className="mt-3">
							<button className="bg-blue-500  text-white px-5 py-2 rounded-md w-full">
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
