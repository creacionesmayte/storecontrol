import React, { useCallback, useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import axios from "axios";

import "./ImageSelection.scss";

// prettier-ignore
function ImageSelection({imgid, colap, mainedit, ...props}) {

	const { Products, Status } = props
    const [error,] = useState("File size should be less than 50 KB")

	let slideIndex = useRef(1);
	
	function plusSlides(n) {
		for(var w=0; w<Products.length; w++) {
			if(colap === w) {
				for(var v=0; v<Products[w].Image.length; v++) {
					if(imgid === v) {
						// console.log(colap, imgid, slideIndex.current, Products[colap].Image[imgid].length)
						if(Products[colap].Image[imgid].length > slideIndex.current) {
							showSlides(slideIndex.current += n);
						} else if((imgid === 0 ? 0 : Products[colap].Image[imgid-1].length) < slideIndex.current) {
							slideIndex.current = Products[colap].Image[imgid].length
							showSlides(slideIndex.current += n)
						} else {
							slideIndex.current = 0
							showSlides(slideIndex.current += n);
						}
						break;
					}
				}
			}
		}
	}

	const showSlides = useCallback((n) => {
		var i;
		var slides = document.getElementsByClassName("slides"+String(colap) + String(imgid));
		var dots = document.getElementsByClassName("any"+ String(colap) + String(imgid));
		// console.log(dots)
		if (n > slides.length) {
			slideIndex.current = 1
		}
		if (n < 1) {
			slideIndex.current = slides.length
		}
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" active", "");
		}
		slides[slideIndex.current-1].style.display = "flex";
		dots[slideIndex.current-1].className += " active";
	}, [colap, imgid])

	const currentSlide = useCallback((n) => {
		showSlides(slideIndex.current = n);
	}, [slideIndex, showSlides])
	// console.log(Products[colap].Image[imgid][0].split('/'))

	useEffect(() => {
		var img = []
		if(Products[colap].Image[imgid] !== undefined && (typeof Products[colap].Image[imgid]) !== 'string') {
			img = Products[colap].Image[imgid]
			// console.log(img[0])
		}
		Products[colap].Image[imgid].map((m, i) => {
			var len = img.length;
			if (i > 0) {
				document.getElementById("all_img_main"+ String(colap) + String(imgid)).innerHTML += `
					<div class="mySlides slides${String(colap) + String(imgid)}" id='slides${String(colap) + String(imgid)}' style="display: none; align-items: center; justify-content: center; max-height: 200px;">
						<button type="button" class="close close${String(colap) + String(imgid)}" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<div class="numbertext">${i + 1} / ${len}</div>
						<img src='${m.url}' style="width: auto; max-height: 200px;" alt=''/>
					</div>
				`;
				document.getElementById("all_img_bottom"+ String(colap) + String(imgid)).innerHTML += `
					<div class="column">
					<img class="demo any${String(colap) + String(imgid)} cursor" src='${m.url}' style="width: auto;  height: 100%;" alt="">
					</div>
				`;
			} else {
				document.getElementById("all_img_main"+ String(colap) + String(imgid)).innerHTML = `
					<div class="mySlides slides${String(colap) + String(imgid)}" style="display: flex; align-items: center; justify-content: center; max-height: 200px;">
						<button type="button" class="close close${String(colap) + String(imgid)}" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<div class="numbertext">${i + 1} / ${len}</div>
						<img src='${m.url}' style="width: auto; max-height: 200px;" alt=''/>
					</div>
				`;
				document.getElementById("all_img_bottom"+ String(colap) + String(imgid)).innerHTML = `
					<div class="column" id='col${String(colap) + String(imgid)}'>
						<img class="demo any${String(colap) + String(imgid)} cursor active" src='${m.url}' style="width: auto; height: 100%;" alt="">
					</div>
				`;
			}
			
			return 0;
		});
		if(document.getElementsByClassName('any'+String(colap) + String(imgid)).length !== 0) {
			for(let p=0; p<document.getElementsByClassName('any'+String(colap) + String(imgid)).length; p++) {
				(function(index) {
					document.getElementsByClassName('any'+ String(colap) + String(imgid))[p].addEventListener("click", function() {
						currentSlide(index+1)
					})
				})(p)
			}
		}
		
		if(document.getElementsByClassName('close'+String(colap) + String(imgid)).length !== 0) {
			for(let x=0; x<document.getElementsByClassName('close'+String(colap) + String(imgid)).length; x++) {
				(function(index) {
					document.getElementsByClassName('close'+ String(colap) + String(imgid))[x].addEventListener("click", async function() {
						// Delete the Image
						const deleteRef = ref(storage, Products[colap].Image[imgid][index].image_path)
						await deleteObject(deleteRef)
							.catch((err) => console.log(err))
						
						Products[colap].Image[imgid].splice(index, 1)
						mainedit('update')
					})
				})(x)
			}
		}
	}, [Products, colap, imgid, currentSlide, mainedit])

	function bytesToSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]];
    }

	const updateImg = async (val) => {
		// console.log(val)
		// Products[colap].Image[imgid].push(val.name)
		var path = `Products/${Products[colap].nombre}${Products[colap].Product_id}/${Products[colap].Color[imgid]}/${val.name}`

		const storageRef = ref(storage, path)
		const uploadTask = uploadBytesResumable(storageRef, val)

		uploadTask.on("state_changed", async (snapshot) => {
			var prog = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			if(prog === 100) {
				await getDownloadURL(uploadTask.snapshot.ref)
					.then(async (url) => {
						Products[colap].Image[imgid].push({
							image_path: path,
							url:url
						})
						await axios.put('https://storecontrolserver-production-1e18.up.railway.app/product/images', {
							Product_id: Products[colap].Product_id,
							Image: JSON.stringify(Products[colap].Image)
						})
						mainedit('Images')
					})
			}
		})
			
		// const formdata = new FormData();
		// formdata.append('productImage', document.getElementsByName("image_name"+ String(colap) + String(imgid))[0].files[t])
		// console.log(Products[colap].Image)
		// await axios.put('product/edit', formdata, {
		// 	headers: {
		// 		'content-type': 'multipart/form-data'
		// 	}
		// }).then(res => {
		// 	if(res.data === 'success') {
		// 		axios.get('product/all').then(res => props.insertproduct(res.data))
		// 	}
		// })
	}
	
	const change = (e) => {
		if(e.target.files[0]) {
			for(var t=0; t<e.target.files.length; t++) {
				var size = bytesToSize(e.target.files[t].size)
				if(size[1] === "KB") {
					if(size[0] <= 500.00) {
						updateImg(e.target.files[t])
						document.getElementById("error"+String(colap) + String(imgid)).style.display = "none"
					} else {
						document.getElementById("error"+String(colap) + String(imgid)).style.display = "inherit"
					}
				} else {
					document.getElementById("error"+String(colap) + String(imgid)).style.display = "inherit"
				}
			}
		}

		// var reader = new FileReader();
		// reader.onload = function (e) {
		// 	img.push(this.result);
		// };
		// if(e.target.files[0]) {
		// 	reader.readAsDataURL(document.getElementsByName("image_name"+ String(colap) + String(imgid))[0].files[0]);
		// }
		
	};

	return (
		<div className="image_selection">
			{
				Status
				? <input type="file" name={"image_name"+ String(colap) + String(imgid)} onChange={change} multiple />
				: <span>Tu no estás conectado</span>
			}
            <div id={"error"+String(colap) + String(imgid)} style={{color: 'red', fontWeight: '500', display: 'none'}}>{error}</div>
			{
				Products[colap].Image[imgid].length === 0
				? null
				: <div className="container">
					<div id={'all_img_main'+ String(colap) + String(imgid)}>
					</div>
					
					<button className="prev" onClick={() => plusSlides(-1)}>❮</button>
					<button className="next" onClick={() => plusSlides(1)}>❯</button>

					<div className="row">
						<div id={'all_img_bottom'+ String(colap) + String(imgid)}>
						</div>
					</div>
				</div>
			}
		</div>
	);
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        insertproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelection);
