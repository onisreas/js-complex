/*
	by Eric Cole
	(C) 2012 Eric Cole
	
	Any use of this code should credit the author.  Enjoy.
*/


function Complex( inReal , inImaginary ) {
	var							result;
	
	result = new Number( inReal );
	result.i = ( ( inImaginary === inImaginary ) ? inImaginary || 0 : inImaginary );
	
	//	""+Complex(1,1) may not invoke toString
	result.toString = Complex.prototype.toString;
	result.toLocaleString = Complex.prototype.toLocaleString;
	result.toExponential = Complex.prototype.toExponential;
	result.toFixed = Complex.prototype.toFixed;
	result.toPrecision = Complex.prototype.toPrecision;
	
	return result;
}


Complex.I = Complex(0,1);


Complex.prototype.toString = function () { return Complex.asString( this ); };
Complex.prototype.toLocaleString = function () { return Complex.asString( this , 'locale' ); };
Complex.prototype.toExponential = function ( inDigits ) { return Complex.asString( this , 'exponential' , inDigits ); };
Complex.prototype.toFixed = function ( inDigits ) { return Complex.asString( this , 'fixed' , inDigits ); };
Complex.prototype.toPrecision = function ( inDigits ) { return Complex.asString( this , 'precision' , inDigits ); };


Complex.enhanceNumber = function
Complex_enhanceNumber() {
	Number.prototype.plus = function ( inY ) { return Complex.sum( this , inY ); }
	Number.prototype.minus = function ( inY ) { return Complex.difference( this , inY ); }
	Number.prototype.times = function ( inY ) { return Complex.product( this , inY ); }
	Number.prototype.over = function ( inD ) { return Complex.quotient( this , inD ); }
	Number.prototype.modulo = function ( inM ) { return Complex.modulo( this , inM ); }
	Number.prototype.reciprocal = function () { return Complex.reciprocal( this ); }
	Number.prototype.pow = function ( inP ) { return Complex.pow( this , inP ); }
	Number.prototype.exp = function () { return Complex.exp( this ); }
	Number.prototype.log = function () { return Complex.log( this ); }
	Number.prototype.sqrt = function () { return Complex.sqrt( this ); }
	Number.prototype.normal = function () { return Complex.normal( this ); }
	Number.prototype.radians = function () { return Complex.radians( this ); }
	Number.prototype.conjugate = function () { return Complex.conjugate( this ); }
	Number.prototype.abs = function () { return Complex.abs( this ); }
	Number.prototype.ceil = function () { return Complex.ceil( this ); }
	Number.prototype.floor = function () { return Complex.floor( this ); }
	Number.prototype.round = function () { return Complex.round( this ); }
};


Complex.from = function
Complex_from( inValue ) {
	var							r , i;
	
	if ( undefined === inValue || null === inValue || isNaN( inValue ) ) return NaN;
	
	r = +inValue.real || +inValue;
	
	if ( isNaN( r ) ) {
		if ( 'function' === typeof inValue.split ) {
			var					match = inValue.match( /([+-]?([0-9]+\.|\.[0-9])[0-9]*([Ee][+-]?[0-9]+)?)\s*([-+]|\*?e\^)\s*(i?)([+-]?([0-9]+\.|\.[0-9])[0-9]*([Ee][+-]?[0-9]+)?)\s*(i?)/ );
			
			if ( null === match || !( a_bi[5] || a_bi[9] ) ) {
				inValue = inValue.split( "," );						//	a,b
			} else if ( 1 === match[4].length ) {
				inValue = [a_bi[1],a_bi[4]+a_bi[6]];				//	a+bi or a+ib
			} else {
				return Complex.fromPolar( +match[1] , +match[6] );	//	n*e^ri or n*e^ir
			}
		}
		
		r = +inValue[0];
	}
	
	if ( arguments.length > 1 ) {
		i = ( +arguments[1] || 0 );
	} else {
		i = ( +inValue.i || +inValue[1] || 0 );
	}
	
	return Complex( r , i );
};


Complex.fromPolar = function
Complex_fromPolar( inMagnitude , inRadians ) {
	var							result = Complex( inMagnitude * Math.cos( inRadians ) , inMagnitude * Math.sin( inRadians ) );
	
	result.normal = Math.abs( inMagnitude );
	result.radians = inRadians;
	
	return result;
};


Complex.sum = function
Complex_sum( inX , inY ) {
	return Complex( inX + inY , ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i ) + ( ( inY.i === inY.i ) ? inY.i || 0 : inY.i ) );
};


Complex.difference = function
Complex_difference( inX , inY ) {
	return Complex( inX - inY , ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i ) - ( ( inY.i === inY.i ) ? inY.i || 0 : inY.i ) );
};


Complex.product = function
Complex_product( inX , inY ) {
	var							result;
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i ) , yi = ( ( inY.i === inY.i ) ? inY.i || 0 : inY.i );
	
	//	ae^bi * ce^di = ace^(b+d)i
	result = Complex( inX * inY - xi * yi , inX * yi + xi * inY );
	
	if ( undefined !== inX.normal && undefined !== inY.normal ) result.normal = inX.normal*inY.normal;
	if ( undefined !== inX.radians && undefined !== inY.radians ) result.radians = inX.radians+inY.radians;
	
	return result;
};


Complex.quotient = function
Complex_quotient( inX , inY ) {
	var							result;
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i ) , yi = ( ( inY.i === inY.i ) ? inY.i || 0 : inY.i );
	
	if ( yi || yi !== yi ) {
		var						d = inY*inY + yi*yi;
		
		result = Complex( ( inX * inY + xi * yi ) / d , ( xi * inY - inX * yi ) / d );
		
		if ( undefined !== inX.normal && undefined !== inY.normal ) result.normal = inX.normal/inY.normal;
		if ( undefined !== inX.radians && undefined !== inY.radians ) result.radians = inX.radians-inY.radians;
	} else if ( undefined !== inX.i ) {
		result = Complex( inX / inY , xi / inY );
		
		if ( undefined !== inX.normal ) result.normal = inX.normal/inY;
		if ( undefined !== inX.radians ) result.radians = inX.radians;
	} else {
		result = inX / inY;
	}
	
	return result;
};


Complex.reciprocal = function
Complex_reciprocal( inX ) {
	var							result;
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( xi || xi !== xi ) {
		var						d = inX*inX + xi*xi;
		
		result = Complex( inX / d , -xi / d );
		
		if ( undefined !== inX.normal ) result.normal = 1/inX.normal;
		if ( undefined !== inX.radians ) result.radians = -inX.radians;
	} else {
		result = 1 / inX;
	}
	
	return result;
};


Complex.modulo = function
Complex_modulo( inX , inM ) {
	return Complex.difference( inX , Complex.product( Complex.floor( Complex.quotient( inX , inM ) ) , inM ) );
};


Complex.pow = function
Complex_pow( inX , inP ) {
	var							result;
	var							ld, er, xd, xr, xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i ), pi = ( ( inP.i === inP.i ) ? inP.i || 0 : inP.i );
	
	if ( xi || xi !== xi ) {
		xd = Complex.normal( inX );
		xr = Complex.radians( inX );
	} else {
		xd = Math.abs( inX );
		xr = ( inX < 0 || ( inX === 0 && 1/inX < 0 ) ) ? Math.PI : 0;	//	handle -0
	}
	
	if ( pi || pi !== pi ) {
		ld = Math.log( xd );		//	(x + ix) = d e^ir = e^( ln(d) + ir )
		ph = pi * ld + inP * xr;
		er = Math.exp( inP * ld - pi * xr );
	} else {
		ph = xr * inP;
		er = Math.pow( xd , inP );
	}
	
	if ( ph || ph !== ph ) {
		result = Complex.fromPolar( er , ph );
	} else {
		result = er;
	}
	
	return result;
};


Complex.exp = function
Complex_exp( inX ) {
	var							result;
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( xi || xi !== xi ) {
		result = Complex.fromPolar( Math.exp( inX ) , xi );
	} else {
		result = Math.exp( inX );
	}
	
	return result;
};


Complex.log = function
Complex_log( inX ) {
	var							result;
	var							er , xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( xi || xi !== xi || inX < 0 ) {
		result = Complex( Math.log( Complex.normal( inX ) ) , Complex.radians( inX ) );
	} else {
		result = Math.log( inX );
	}
	
	return result;
};


Complex.sqrt = function
Complex_sqrt( inX ) {
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( xi || xi !== xi ) {
		return Complex.fromPolar( Math.sqrt( Complex.normal( inX ) ) , Complex.radians( inX )*0.5 );
	} else {
		return Math.sqrt( inX );
	}
	
	return Complex.pow( inX , 0.5 );
};


Complex.asString = function
Complex_asString( inX ) {
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	var							a , b;
	
	var							method;
	var							format = arguments[1];
	var							polar = false;
	
	if ( 'polar' === format ) {
		format = null;
		polar = true;
	} else if ( 'polar-fixed' === format || 'polar-exponential' === format || 'polar-precision' === format || 'polar-locale' === format ) {
		format = format.substring( 6 , 7 );	//	f,e,p,l
		polar = true;
	} else if ( format & 4 ) {
		format = format & 3;	//	0,1,2,3
		polar = true;
	}
	
	if ( 1 == format || 'f' === format || 'fixed' === format ) {
		method = Number.prototype.toFixed;
	} else if ( 2 == format || 'e' === format || 'exponential' === format ) {
		method = Number.prototype.toExponential;
	} else if ( 3 == format || 'p' === format || 'precision' === format ) {
		method = Number.prototype.toPrecision;
	} else if ( 'l' === format || 'locale' === format ) {
		method = Number.prototype.toLocaleString;
	} else {
		method = Number.prototype.toString;
	}
	
	if ( undefined === inX.i ) {
		a = inX;
	} else if ( polar ) {
		a = Complex.normal( inX );
		b = Complex.radians( inX );
	} else {
		a = inX;
		b = xi;
	}
	
	if ( a !== a || b !== b ) {
		a = "NaN";
		b = undefined;
	} else if ( arguments.length > 2 ) {
		a = method.call( a , arguments[2] );
		if ( undefined !== b ) b = method.call( b , arguments[2] );
	} else {
		a = method.call( a );
		if ( undefined !== b ) b = method.call( b );
	}
	
	return ( undefined !== b ) ? a + ( polar ? "*e^" : xi < 0 ? "" : "+" ) + b + "i" : a;
};


//	sometimes called norm, magnitude, mod, modulus, length, absolute value
Complex.normal = function
Complex_normal( inX ) {
	var							result = inX.normal;
	
	if ( undefined === result ) {
		var						xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
		
		if ( xi || xi !== xi ) {
			result = Math.sqrt( inX * inX + xi * xi );
			
			inX.normal = result;
		} else {
			result = Math.abs( inX );
		}
	}
	
	return result;
};


//	sometimes called arg, argument, angle, theta
Complex.radians = function
Complex_radians( inX ) {
	var							result = inX.radians;
	
	if ( undefined === result ) {
		var						xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
		
		if ( xi || xi !== xi ) {
			result = Math.atan2( xi , inX );
			
			inX.radians = result;
		} else {
			result = ( inX < 0 || ( inX === 0 && 1/inX < 0 ) ) ? Math.PI : 0;	//	handle -0
		}
	}
	
	return result;
};


Complex.conjugate = function
Complex_conjugate( inX ) {
	return Complex( inX , ( ( inX.i === inX.i ) ? -inX.i || 0 : inX.i ) );
};


Complex.isReal = function
Complex_isReal( inX ) {
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( arguments.length > 1 ) {
		var						epsilon = arguments[1];
		
		return ( xi === xi ) && ( Math.abs( xi || 0 ) <= epsilon );
	} else {
		return ( xi === xi ) && !( xi > 0 || xi < 0 );
	}
};


Complex.isNaN = function
Complex_isNaN( inX ) {
	return ( undefined == inX ) || ( inX !== inX ) || ( inX.i !== inX.i );
};


Complex.isFinite = function
Complex_isFinite( inX ) {
	return isFinite( inX ) && isFinite( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
};


Complex.isZero = function
Complex_isZero( inX ) {
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( arguments.length > 1 ) {
		var						epsilon = arguments[1];
		
		return ( Math.abs( inX ) <= epsilon ) && ( Math.abs( xi ) <= epsilon );
	} else {
		return !( inX > 0 || inX < 0 ) && !( xi > 0 || xi < 0 );
	}
};


Complex.compare = function
Complex_compare( inX , inY ) {
	var							xn = Complex.normal( inX );
	var							yn = Complex.normal( inY );
	
	//	compare only magnitude
	if ( arguments.length > 2 ) {
		var						epsilon = arguments[2];
		
		return ( Math.abs( xn - yn ) <= epsilon ) ? 0 : xn < yn ? -1 : 1;
	} else {
		return ( xn < yn ) ? -1 : ( xn > yn ) ? 1 : 0;
	}
};


Complex.compareReal = function
Complex_compareReal( inX , inY ) {
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	var							yi = ( ( inY.i === inY.i ) ? inY.i || 0 : inY.i );
	
	//	comapre real then, if equal, imaginary parts
	if ( arguments.length > 2 ) {
		var						epsilon = arguments[2];
		
		return ( Math.abs( inX - inY ) <= epsilon ) ? ( ( Math.abs( xi - yi ) <= epsilon ) ? 0 : xi < yi ? -1 : 1 ) : inX < inY ? -1 : 1;
	} else {
		return ( inX < inY ) ? -1 : ( inX > inY ) ? 1 : ( xi < yi ) ? -1 : ( xi > yi ) ? 1 : 0;
	}
};


Complex.real = function
Complex_real( inX ) {
	return inX.valueOf();
};


Complex.imaginary = function
Complex_imaginary( inX ) {
	var							i = inX.i;
	
	return ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );	//	preserve NaN
};


//	positive quadrant, not normal
Complex.abs = function
Complex_abs( inX ) {
	return Complex( Math.abs( inX ) , Math.abs( ( inX.i === inX.i ) ? inX.i || 0 : inX.i ) );
};


Complex.ceil = function
Complex_ceil( inX ) {
	return Math.ceil( Complex.normal( inX ) );
};


Complex.floor = function
Complex_floor( inX ) {
	return Math.floor( Complex.normal( inX ) );
};


Complex.round = function
Complex_round( inX ) {
	return Math.round( Complex.normal( inX ) );
};


Complex.max = function
Complex_max( inX , inY ) {
	//	return input with greater normal
	return Complex.normal( inY ) > Complex.normal( inX ) ? inY : inX;
};


Complex.min = function
Complex_min( inX , inY ) {
	//	return input with lesser normal
	return Complex.normal( inY ) < Complex.normal( inX ) ? inY : inX;
};


Complex.random = function
Complex_random() {
	var							result;
	
	if ( arguments[0] ) {
		//	unit circle with uniform distribution of magnitude not area
		result = Complex.fromPolar( Math.random() , Math.PI * 2.0 * ( Math.random() - 0.5 ) );
	} else {
		//	positive quadrant of unit square
		result = Complex( Math.random() , Math.random() );
	}
	
	return result;
};


/***

sin(z) = sin(x)*cosh(y) + i*cos(x)*sinh(y)
cos(z) = cos(x)*cosh(y) - i*sin(x)*sinh(y)

sin(z) = ( e^iz - e^-iz ) / 2i
cos(z) = ( e^iz + e^-iz ) / 2

sinh(x) = ( e^x - e^-x ) / 2 = ( e^2x - 1 ) / 2e^x = ( 1 - e^-2x ) / 2e^-x
cosh(x) = ( e^x + e^-x ) / 2 = ( e^2x + 1 ) / 2e^x = ( 1 + e^-2x ) / 2e^-x

cosh(x) + sinh(x) = e^x
cosh(x) - sinh(x) = e^-x

tan(z) = sin(z)/cos(z) = i( e^iz - e^-iz ) / ( e^iz + e^-iz ) = ( e^2iz - 1 ) / i( e^2iz + 1 )
tan(z) = ( sin(x)cos(x) + i sinh(x)cosh(y) ) / ( cos^2(x) + sinh^2(y) )

***/

Complex.sin = function
Complex_sin( inX ) {
//	sin(z) = ( e^iz - e^-iz ) / 2i = sin(x)*cosh(y) + i*cos(x)*sinh(y)
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	var							ex , ch , sh;
	
	if ( xi ) {
		ex = Math.exp( xi );
		ch = ( ex * ex + 1 ) / ( 2.0 * ex );
		sh = ex - ch;	//	cosh(x) + sinh(x) = e^x
	} else {
		ch = 1.0;
		sh = 0.0;
	}
	
	return sh ? Complex( Math.sin( inX ) * ch , Math.cos( inX ) * sh ) : Math.sin( inX ) * ch;
};


Complex.cos = function
Complex_cos( inX ) {
//	cos(z) = ( e^iz + e^-iz ) / 2 = cos(x)*cosh(y) - i*sin(x)*sinh(y)
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	var							ex , xx , ch , sh;
	
	if ( xi ) {
		ex = Math.exp( xi );
		ch = ( ex * ex + 1 ) / ( 2.0 * ex );
		sh = ch - ex;	//	negative i sinh
	} else {
		ch = 1.0;
		sh = 0.0;
	}
	
	return sh ? Complex( Math.cos( inX ) * ch , Math.sin( inX ) * sh ) : Math.cos( inX ) * ch;
};


Complex.tan = function
Complex_tan( inX ) {
//	tan(z) = ( sin(x)cos(x) + i sinh(x)cosh(y) ) / ( cos^2(x) + sinh^2(y) )
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	var							ex , xx , ch , sh , cs , dn;
	
	if ( xi ) {
		ex = Math.exp( xi );
		ch = ( ex * ex + 1 ) / ( 2.0 * ex );
		sh = ex - ch;	//	cosh(x) + sinh(x) = e^x
		
		cs = Math.cos( inX );
		dn = cs * cs + sh * sh;
	} else {
		ch = 1.0;
		sh = 0.0;
	}
	
	return sh ? Complex( Math.sin( inX ) * cs / dn , sh * ch / dn ) : Math.tan( inX ) * ch;
};


Complex.sec = function
Complex_sec( inX ) {
	return Complex.reciprocal( Complex.sin( inX ) );
};


Complex.csc = function
Complex_csc( inX ) {
	return Complex.reciprocal( Complex.cos( inX ) );
};


Complex.cot = function
Complex_cot( inX ) {
	return Complex.reciprocal( Complex.tan( inX ) );
};


Complex.asin = function
Complex_asin( inX ) {
	//	asin(z) = -i ln( iz + sqrt( 1 - z*z ) )
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( xi || xi !== xi ) {
		var						rt = Complex.sqrt( Complex( 1 + xi*xi - inX*inX , -2 * inX * xi ) );
		var						ln = Complex.log( Complex( rt - xi , rt.i + inX ) );
		
		return Complex( ln.i , -ln );
	} else {
		return Math.asin( inX );
	}
};


Complex.acos = function
Complex_acos( inX ) {
	//	acos(z) = -i ln( z + i sqrt( 1 - z*z ) )
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( xi || xi !== xi ) {
		var						rt = Complex.sqrt( Complex( 1 + xi*xi - inX*inX , -2 * inX * xi ) );
		var						ln = Complex.log( Complex( inX - rt.i , xi + rt ) );
		
		return Complex( ln.i , -ln );
	} else {
		return Math.asin( inX );
	}
};


/***
	atan x+yi
	
	y x      -i    -n    -0    +0    +n    +i
	-i       -pi/2 -pi/2 -pi/2 +pi/2 +pi/2 +pi/2
	-n       -pi/2 -     ...   ...   +     +pi/2
	-0       -pi/2 -pi/4 -0    +0    +pi/4 +pi/2
	+0       -pi/2 -pi/4 -0    +0    +pi/4 +pi/2
	+n       -pi/2 -     ...   ...   +     +pi/2
	+i       -pi/2 -pi/2 -pi/2 +pi/2 +pi/2 +pi/2
	
	x = +- 0
	0<y<1 : r = 0 +- i arctanh(1/y) as +- y
	y = 1 : r = 0 +- infinity i as +- y
	y > 1 : r = +- pi/4 +- i arctanh(y)
***/

Complex.atan = function
Complex_atan( inX ) {
	//	atan(z) = i/2 ( ln( 1 - iz ) - ln( 1 + iz ) )
	var							xi = ( ( inX.i === inX.i ) ? inX.i || 0 : inX.i );
	
	if ( inX !== inX || xi !== xi ) {
		return NaN;
	} else if ( !isFinite( xi ) || !isFinite( inX ) ) {
		return Math.PI * ( ( inX < 0 || 1/inX < 0 ) ? -0.5 : 0.5 );
	} else if ( !xi ) {
		return Math.atan( inX );
	} else {
		var						ln_1miz , ln_1piz;
		
		ln_1miz = Complex.log( Complex( 1 + xi , -inX ) );
		ln_1piz = Complex.log( Complex( 1 - xi , +inX ) );
		
		return Complex( ( ( ln_1piz.i || 0 ) - ( ln_1miz.i || 0 ) )*0.5 , ( ln_1miz - ln_1piz )*0.5 );
	}
};


Complex.asec = function
Complex_asec( inX ) {
	return Complex.acos( Complex.reciprocal( inX ) );
};


Complex.acsc = function
Complex_acsc( inX ) {
	return Complex.asin( Complex.reciprocal( inX ) );
};


Complex.acot = function
Complex_acot( inX ) {
	return Complex.atan( Complex.reciprocal( inX ) );
};


Complex.atan2 = function
Complex_atan2( inY , inX ) {
	var							result;
	
	if ( Complex.isNaN( inX ) || Complex.isNan( inY ) ) {
		result = NaN;											//	atan(NaN)
	} else if ( Complex.isZero( inY ) ) {
		result = 0;												//	atan(0)
	} else if ( Complex.isZero( inX ) ) {
		result = Math.PI * ( ( 1/inX < 0 ) ? -0.5 : 0.5 );		//	atan(1/0)
	} else if ( !Complex.isFinite( inY ) ) {
		result = Math.PI * ( ( inX*inY < 0 ) ? -0.5 : 0.5 );	//	atan(inf)
	} else if ( !Complex.isFinite( inX ) ) {
		result = 0;												//	atan(1/inf)
	} else {
		result = Complex.atan( Complex.quotient( inY , inX ) );	//	atan(y/x)
	}
	
	return result;
};


//	cosh, sinh, tanh, acosh, asinh, atanh
