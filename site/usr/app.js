$(document).ready(function() {

	$('.init1').typeIt({
		speed: 25,
		lifeLike: true,
		autoStart: true,
		loop: false,
		cursor: false
	});
	$('.init2').typeIt({
		startDelay: 1000,
		speed: 50,
		lifeLike: true,
		autoStart: true,
		loop: false,
		cursor: false
	});

	$('.help,.user,#userInput').delay(8000).fadeIn(1);

	setTimeout(function() {
		$('#userInput').trigger('focus');
		$('#userInput').text('');
		$('.boot').remove();
	}, 8000);

	var output = $('.output');
	var input = $('#userInput');
	var toOutput;
	var pw = 0;
	console.log('pw: ' + pw);
	var rt = 0;
	console.log('rt: ' + rt);
	var inputVal;

	input.bind('keyup', function(e) {

		if (e.which == 13) {
			e.preventDefault();
			inputVal = $.trim(input.text().toLowerCase());

			// Process commands
			if (inputVal == "about") {
				About();
			} else if (inputVal == "exit") {
				ExitSystem();
			} else if (inputVal == "clear") {
				ClearConsole();
			} else if (inputVal == "contact") {
				Contact();
			} else if (inputVal == "login") {
				Login();
			} else if (inputVal == "logout" && rt) {
				Logout();
			} else if (inputVal == "password" && pw) {
				AccessGranted();
			} else if (inputVal == "pwhint") {
				PasswordHint();
			} else if (inputVal == "report" && rt) {
				Report();
			} else if (inputVal == "help") {
				if (rt) {
					HelpRoot();
				} else {
					HelpUsr();
				}
			} else {
				UnknownCommand();
			}
		}
	});

	// Displays the result of the command
	function Output(data) {
		$(data).appendTo(output);
		input.text('');
	}

	// Displays a separator
	function Separator() {
		Output('<p><span class="separator typed"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
	}

	// Auto-scrolls to input
	function Scroll() {
		
		$('#container').animate({
        scrollTop: $('#container')[0].scrollHeight
    }, 250);
		console.log('Scrolled');
	}

	// Clears the screen
	function ClearConsole() {
		output.html('');
		Output('<p><span>> Console cleared.</span></p>');
		Scroll();
	}

	function HelpUsr() {
		var commandsUserArray = ['> Available \'usr\' commands', '>&nbsp;&nbsp;about', '>&nbsp;&nbsp;clear', '>&nbsp;&nbsp;contact', '>&nbsp;&nbsp;exit', '>&nbsp;&nbsp;help', '>&nbsp;&nbsp;login', '>&nbsp;&nbsp;pwhint'];
		for (var i = 0; i < commandsUserArray.length; i++) {
			var out = '<span>' + commandsUserArray[i] + '</span><br>'
			Output(out);
		}
		Scroll();
	}

	function HelpRoot() {
		var commandsRootArray = ['> Available \'root\' commands', '>&nbsp;&nbsp;about', '>&nbsp;&nbsp;clear', '>&nbsp;&nbsp;contact', '>&nbsp;&nbsp;exit', '>&nbsp;&nbsp;help', '>&nbsp;&nbsp;logout', '>&nbsp;&nbsp;report'];
		for (var i = 0; i < commandsRootArray.length; i++) {
			var out = '<span>' + commandsRootArray[i] + '</span><br>'
			Output(out);
			$(".action div span").empty().append('root@remote:~$ ');
		}
		Scroll();
	}

	function Login() {
		pw = 1;
		console.log('pw: ' + pw);
		var loginArray = ['> Login'];
		for (var i = 0; i < loginArray.length; i++) {
			var out = '<p><span>' + loginArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('password: ');
			input.text('');
			$('#userInput').addClass('password');
			$('#userInput').focus();
		}
		Scroll();
	}

	function AccessGranted() {
		pw = 0;
		console.log('pw: ' + pw);
		rt = 1;
		console.log('rt: ' + rt);
		var accessGrantedArray = ['> Login successful. Root access granted.'];
		for (var i = 0; i < accessGrantedArray.length; i++) {
			var out = '<p><span>' + accessGrantedArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('root@remote:~$ ');
			$('#userInput').removeClass('password');
		}
		Scroll();
	}

	function PasswordHint() {
		var passwordHintArray = ['> Password hint', '> Default'];
		Separator();
		for (var i = 0; i < passwordHintArray.length; i++) {
			var out = '<p><span>' + passwordHintArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function About() {
		var aboutArray = ['> About', '> This is an interactive console experiment.'];
		Separator();
		for (var i = 0; i < aboutArray.length; i++) {
			var out = '<p><span>' + aboutArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Contact() {
		var contactArray = ['> Contact', '> <a href="mailto:"hr@hmlabs.com">hr@hmlabs.com</a>'];
		Separator();
		for (var i = 0; i < contactArray.length; i++) {
			var out = '<p><span>' + contactArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Report() {
		var reportArray = ['> Report', '> Content here...'];
		Separator();
		for (var i = 0; i < reportArray.length; i++) {
			var out = '<p><span>' + reportArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('root@remote:~$ ');
		}
		Separator();
		Scroll();
	}

	function Logout() {
		rt = 0;
		console.log('rt: ' + rt);
		var logoutArray = ['> Logged out. Root access revoked.'];
		for (var i = 0; i < logoutArray.length; i++) {
			var out = '<p><span>' + logoutArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('usr@remote:~$ ');
		}
		Scroll();
	}

	function UnknownCommand() {
		if (!pw && !rt || rt) {
			Output('<p><span>- ' + inputVal + ': Command not found.</span></p>');
		} else if (pw) {
			Output('<p><span>- Incorrect password.</span></p>');
			pw = 0;
		}
		input.text('');
		$('#userInput').removeClass('password');
		if (!rt) {
			$(".action div span").empty().append('usr@remote:~$ ');
			}
		Scroll();
	}

	function ExitSystem() {
		output.html('');
		Output('<p class="processing">Exiting system. Please wait...</p>');
		$('.help,.user,#userInput').remove();
		setTimeout(function() {
			window.open('http://samoff.com', '_self');
		}, 4000);
	}
});