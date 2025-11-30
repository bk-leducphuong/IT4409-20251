function Footer() {
    
    const listStyle = {
        display:"flex",
        flexDirection:"column",
        gap:"0.8rem",
        maxWidth:"15%"
    }

    const listHeader = {
        fontSize:"1.3rem",
        fontWeight:"bold",
        paddingBottom:"1rem"
    }
    
    return (
        <footer style={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            width:"100%",
            backgroundColor:"black",
            color:"white"
        }}>
            <div style={{
                display:"flex",
                justifyContent:"space-between",
                width:"90%",
                maxWidth:"1400px",
                padding:"3rem 1rem",
                fontFamily:'"Nunito Sans", sans-serif',
            }}>
                <div style={listStyle}>
                    <div style={listHeader}>Exclusive</div>
                    <div style={{
                        fontSize:"1.1rem",
                        fontWeight:"bold"
                    }}>Subcribe</div>
                    <div>Get 10% off your first order</div>
                    <div style={{ position:"relative "}}>
                        <input type="email" placeholder="Enter your email" style={{
                            width:"100%",
                            padding:"0.5rem",
                            border:"2px solid white",
                            borderRadius:"5px",
                            backgroundColor:"black"
                        }}/>
                        <i className="fa-regular fa-paper-plane" style={{
                            position:"absolute",
                            right:"1rem",
                            top:"50%",
                            transform:"translateY(-50%)"
                        }}></i>
                    </div>
                </div>
                <div style={listStyle}>
                    <div style={listHeader}>Support</div>
                    <div>111 Bijoy sarani Dhaka, DH 1515, Bangladesh</div>
                    <div>exclusive@gmail.com</div>
                    <div>+88015-88888-9999</div>
                </div>
                <div style={listStyle}>
                    <div style={listHeader}>Account</div>
                    <div>My account</div>
                    <div>Login / Register</div>
                    <div>Cart</div>
                    <div>Wishlist</div>
                    <div>Shop</div>
                </div>
                <div style={listStyle}>
                    <div style={listHeader}>Quick Link</div>
                    <div>Privacy Policy</div>
                    <div>Terms Of Use</div>
                    <div>FAQ</div>
                    <div>Contact</div>
                </div>
                <div style={listStyle}>
                    <div style={listHeader}>Download App</div>
                    <div style={{
                        fontSize:"0.8rem",
                        color:"grey"
                    }}>Save $3 with App New User Only</div>
                    <div style={{
                        display:"flex",
                        height:"5rem"
                    }}>
                        <div style={{ height:"100%", paddingRight:"0.5rem" }}>
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                alt="QR code"
                                style={{
                                    height:"100%",
                                    width:"auto"
                                }}
                            />
                        </div>
                        <div style={{
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"space-between",
                            height:"100%"
                        }}>
                            <div style={{ height:"45%" }}>
                                <img src="https://qldt.hust.edu.vn/students/_next/image?url=%2Fstudents%2Fimages%2Fchplay-en.png&w=384&q=75" alt="Google Play" style={{
                                    height:"100%",
                                    width:"auto"
                                }}/>
                            </div>
                            <div style={{ height:"50%" }}>
                                <img src="https://qldt.hust.edu.vn/students/_next/image?url=%2Fstudents%2Fimages%2Fappstore-en.avif&w=384&q=75" alt="App Store" style={{
                                    height:"auto",
                                    width:"100%"
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display:"flex",
                        gap:"1rem"
                    }}>
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-linkedin-in"></i>
                    </div>
                </div>
            </div>
            <div style={{
                textAlign:"center",
                color:"hsl(0,0%,25%)",
                padding:"1rem",
                borderTop:"1px solid hsl(0,0%,10%)",
                width:"100%"
            }}>&copy; Copyright Rimel 2022. All right reserved</div>
        </footer>
    );
}

export default Footer;