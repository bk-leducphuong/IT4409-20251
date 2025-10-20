
function Navbar() {

    const linkStyle = {
        textDecoration:"none",
        color:"black"
    };

    return (
        <nav style={{
            display: "flex",
            padding: "2rem 3rem 1rem",
            margin: "0",
            gap:"1rem",
            alignItems:"center",
            fontFamily:'"Nunito Sans", sans-serif',
            borderBottom:"1px solid grey"
        }}>
            <div style={{
                fontSize:"1.5rem",
                fontWeight:"bold"
            }}>Exclusive</div>

            <div style={{
                flex:"1 1 0",
                display:"flex",
                justifyContent:"center"
            }}>
                <ul style={{
                    display:"flex",
                    justifyContent:"space-between",
                    width:"clamp(300px, 50%, 600px)"
                }}>
                    <li style={{listStyleType:"none"}}><a href="#" style={linkStyle}>Home</a></li>
                    <li style={{listStyleType:"none"}}><a href="#" style={linkStyle}>Contact</a></li>
                    <li style={{listStyleType:"none"}}><a href="#" style={linkStyle}>About</a></li>
                    <li style={{listStyleType:"none"}}><a href="#" style={linkStyle}>Sign Up</a></li>
                </ul>
            </div>

            <div style={{
                position:"relative"
            }}>
                <input type="text" placeholder="What are you looking for?" style={{
                    backgroundColor:"hsl(0,0%,90%)",
                    border:"none",
                    borderRadius:"10px",
                    padding:"0.75rem",
                    paddingRight:"2.5rem",
                    width:"100%"
                }}/>
                <i class="fa-solid fa-magnifying-glass" style={{
                    position:"absolute",
                    right:"0.75rem",
                    top:"50%",
                    transform:"translateY(-50%)"
                }}></i>
            </div>

            <div style={{
                display:"flex",
                gap:"1rem",
                fontSize:"1.5rem"
            }}>
                <i class="fa-regular fa-heart"></i>
                <i class="fa-solid fa-cart-shopping"></i>
                <i class="fa-solid fa-circle-user" style={{ color:"red" }}></i>
            </div>
        </nav>
    );
}

export default Navbar;