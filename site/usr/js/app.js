$(document).ready(function()
{
	// Variables-R-Us
	var output = $('.output');
	var input = $('#userInput');
	var toOutput;
	var un = false;
	var pw = false;
	var rt = false; // Debug true: Should be false for production!
	var records = false; // Debug true: Should be false for production!
	var trash = false;
	var recordsArray1 = ['a.dat','b.dat','c.dat','d.dat','e.dat','f.dat'];
	var recordsArray2 = ['g.dat','h.dat','i.dat','j.dat','k.dat','l.dat'];
	var recordsArray3 = ['m.dat','n.dat','o.dat','p.dat','q.dat','r.dat'];
	var recordsArray4 = ['s.dat','t.dat','u.dat','v.dat','w.dat','x.dat'];
	var recordsArray5 = ['y.dat','z.dat'];
	var a=b=c=d=e=f=g=h=i=j=k=l=m=n=o=p=q=r=s=t=u=v=w=x=y=z = false;
	var rmOK = false;
	var noX = false;
	var rmXTimer; 
	var inputVal;
	var rmVal;
	var totalTime = 900; // 900; // Amount of time (sec)
   	var halfTime = Math.floor(totalTime * 0.5);
   	var quarterTime = Math.floor(totalTime * 0.25);
   	var noTime = Math.floor(totalTime * 0.05);

	if (!localStorage.getItem('gameOver'))
	{
		$('.init1').typeIt(
		{
			speed: 25,
			lifeLike: true,
			autoStart: true,
			loop: false,
			cursor: false
		});
		$('.init2').typeIt(
		{
			startDelay: 1000,
			speed: 50,
			lifeLike: true,
			autoStart: true,
			loop: false,
			cursor: false
		});

		$('.output').delay(1000).fadeIn(1);
		$('.help,.user,#userInput').delay(8000).fadeIn(1);

		setTimeout(function()
		{
			$('#userInput').focus();
			$('#userInput').text('');
			$('.boot').remove();
			
			$('<div id="cd"></div>').insertAfter('#container');
			
			if (!localStorage.getItem('cdTime'))
			{
				var now = $.now(); // First time on page
				localStorage.setItem('firstTime', now,
			{
				expires: 7,
				path: '/'
			});
				localStorage.setItem('cdTime', totalTime,
				{
					expires: 7,
					path: '/'
				});
				var runTimer = localStorage.getItem('cdTime');
			}
			else
			{
				var currentTime = $.now();
				var usedTime = (currentTime - localStorage.getItem('firstTime')) / 1000; // Calculate and convert into seconds
				var runTimer = localStorage.getItem('cdTime') - usedTime;
			}
			$('#cd').countdown(
			{
				until: runTimer,
				compact: true,
				// onExpiry: EndCountdown,
				onTick: Callbacks,
				layout: 'Next backup: {h10}{h1}:{m10}{m1}:{s10}{s1}'
			});

			function Callbacks(periods)
			{
				if ($.countdown.periodsToSeconds(periods) <= halfTime)
				{
					// console.log('50% left!');
					ht = true;
					$('#cd').addClass('hurryUp50');
				}
				if ($.countdown.periodsToSeconds(periods) <= quarterTime)
				{
					// console.log('25% left!');
					$('#cd').removeClass('hurryUp50').addClass('hurryUp25');
				}
				if ($.countdown.periodsToSeconds(periods) <= noTime)
				{
					// console.log('5% left!');
					$('#cd').removeClass('hurryUp25').addClass('hurryUp5');
				}
				if ($.countdown.periodsToSeconds(periods) <= 0)
				{
					console.log('Out of time!');
					OutOfTime();
				}
			}
		}, 8000);
	}
	else
	{
		noX = true;
		$('.output').delay(1000).fadeIn(1);
		ExitSystem();
	}

	ConsoleOutput();

	$(document).bind( 'click', function()
	{
		console.log('Regain focus.');
		input.focus();
	});

	input.bind('keyup', function(e)
	{

		if (e.which == 9)
	    {
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
	        input.focus();
	   	}
		if (e.which == 13)
		{
			e.preventDefault();
			inputVal = $.trim(input.text().toLowerCase());

			// Process commands
			if (inputVal == 'about')
			{
				About();
			}
			else if (inputVal == 'exit')
			{
				ExitSystem();
			}
			else if (inputVal == 'clear')
			{
				ClearConsole();
			}
			else if (inputVal == 'contact')
			{
				Contact();
			}
			else if (inputVal == 'login' && !rt)
			{
				Login();
			}
			else if (inputVal == 'logout' && rt)
			{
				Logout();
			}
			else if (inputVal == 'nickyates' && un)
			{
				EnterPassword();
			}
			else if (inputVal != 'nickyates' && un)
			{
				WrongUn();
			}
			else if (inputVal == 'will remember' && pw)
			{
				AccessGranted();
			}
			else if (inputVal == 'willremember' && pw)
			{
				AccessGranted();
			}
			else if (inputVal == 'y' && pw && !rmOK)
			{
				PasswordHint();
			}
			else if (inputVal == 'n' && pw && !rmOK)
			{
				ResetPassword();
			}
			else if (inputVal == 'ls')
			{
				Ls();
			}
			else if (inputVal.startsWith('cd'))
			{
				Cd(inputVal);
			}
			else if (inputVal.startsWith('cat'))
			{
				Cat(inputVal);
			}
			else if (inputVal.startsWith('rm'))
			{
				Rm(inputVal);
			}
			else if (inputVal == 'y' && rmOK && !pw)
			{
				rmSupport();
			}
			else if (inputVal == 'n' && rmOK && !pw)
			{
				ResetRm();
			}
			else if (inputVal == 'help')
			{
				Help();
			}
			else
			{
				UnknownCommand();
			}
		}
	});

	function ConsoleOutput()
	{
		console.log('########' + '\n' + 'un: ' + un + '\n' + 'pw: ' + pw + '\n' + 'rt: ' + rt + '\n' + 'records: ' + records + '\n' + 'trash: ' + trash + '\n' + 'rmOK: ' + rmOK + '\n' + 'noX: ' + noX);
	}

	// Displays the result of the command
	function Output(data)
	{
		$(data).appendTo(output);
		input.text('');
	}

	function OutputRecords(data)
	{
		$(data).appendTo('.colcont');
		input.text('');
	}

	// Displays a separator
	function Separator()
	{
		Output('<p><span class="separator typed"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
	}

	// Auto-scrolls to input
	function Scroll()
	{
		
		$('#container').animate(
		{
        scrollTop: $('#container')[0].scrollHeight
    	}, 250);
		// console.log('Scrolled');
		ConsoleOutput();
		input.text('');
		input.focus();
	}

	// Clears the screen
	function ClearConsole()
	{
		output.html('');
		Output('<p><span>> Console cleared.</span></p>');
		Scroll();
	}

	function Help()
	{
		if (rt)
		{
			var helpArray = ['> Available \'admin\' commands', '<div class="colcont"><div class="col50">>&nbsp;&nbsp;Help<br>>&nbsp;&nbsp;About<br>>&nbsp;&nbsp;Contact<br>>&nbsp;&nbsp;Clear<br>>&nbsp;&nbsp;Logout</div><div class="col50">>&nbsp;&nbsp;ls<br>>&nbsp;&nbsp;cd ..<br>>&nbsp;&nbsp;cd <em>dirname</em><br>>&nbsp;&nbsp;rm <em>filename<br>>&nbsp;&nbsp;cat <em>filename</em></div></div>'];
		}
		else
		{
		var helpArray = ['> Available \'usr\' commands', '<div class="colcont"><div class="col50">>&nbsp;&nbsp;Help<br>>&nbsp;&nbsp;About<br>>&nbsp;&nbsp;Contact<br>>&nbsp;&nbsp;Clear<br>>&nbsp;&nbsp;Login<br>>&nbsp;&nbsp;Exit</div><div class="col50">>&nbsp;&nbsp;ls<br>>&nbsp;&nbsp;cd ..<br>>&nbsp;&nbsp;cd <em>dirname</em><br>>&nbsp;&nbsp;rm <em>filename<br>>&nbsp;&nbsp;cat <em>filename</em></div></div>'];
		}
		for (var i = 0; i < helpArray.length; i++)
		{
			var out = '<span>' + helpArray[i] + '</span><br>'
			Output(out);
			if (rt)
			{
				$(".action div span").empty().append('root@remote:~$ ');
			}
		}
		Scroll();
	}

	function Login()
	{
		un = true;
		var loginArray = ['> Login'];
		for (var i = 0; i < loginArray.length; i++)
		{
			var out = '<p><span>' + loginArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('username: ');
			// input.text('');
			// input.focus();
		}
		Scroll();
	}

	function WrongUn()
	{
		un = false;
		var logoutArray = ['> Username not found.'];
		for (var i = 0; i < logoutArray.length; i++)
		{
			var out = '<p><span>' + logoutArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('usr@remote:~$ ');
		}
		Scroll();
	}

	function EnterPassword()
	{
		un = false;
		pw = true;
		var loginArray = [''];
		for (var i = 0; i < loginArray.length; i++)
		{
			var out = '<p><span>' + loginArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('password: ');
			input.addClass('password');
			// input.text('');
			// input.focus();
		}
		Scroll();
	}

	function AccessGranted()
	{
		pw = false;
		rt = true;
		var accessGrantedArray = ['> Login successful. Root access granted. All activity is being logged.'];
		for (var i = 0; i < accessGrantedArray.length; i++)
		{
			var out = '<p><span>' + accessGrantedArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('root@remote:~$ ');
			input.removeClass('password');
		}
		Scroll();
	}

	function PasswordUsr()
	{
		var loginArray = ['> Required'];
		for (var i = 0; i < loginArray.length; i++)
		{
			var out = '<p><span>' + loginArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('usr: ');
			// input.text('');
		}
		Scroll();
	}

	function PasswordHint()
	{
		var passwordHintArray = ['> Password hint', '> "won\'t forget."'];
		Separator();
		for (var i = 0; i < passwordHintArray.length; i++)
		{
			var out = '<p><span>' + passwordHintArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Login();
		Scroll();
	}

	function ResetPassword()
	{
		pw = false;
		$(".action div span").empty().append('usr@remote:~$ ');
		Scroll();
	}

	function ResetRm()
	{
		$(".action div span").empty().append('root@remote:~$ ');
		Scroll();
	}

	function About()
	{
		var aboutArray = ['> About', '> HMLabs: The National Think Tank','> Considering breakthrough technologies for national security.','> This portal provides secure access to HMLabs data.'];
		Separator();
		for (var i = 0; i < aboutArray.length; i++) 
		{
			var out = '<p><span>' + aboutArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Contact()
	{
		var contactArray = ['> Contact', '> All access issues should be sent to <u>admin@hmlabs.mil</u>.'];
		Separator();
		for (var i = 0; i < contactArray.length; i++)
		{
			var out = '<p><span>' + contactArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Ls()
	{
		if (records)
		{
			$( '.colcont' ).remove();
			LsRecords();
		}
		else
		{
			if (trash)
			{
				var lsArray = ['../','<em>Another one.eml</em><br><em>Urgent.eml</em>'];
			}
			else
			{
				var lsArray = ['./','Records [26 files]<br>Trash [2 files]<br>README.dat'];
			}
			Separator();
			for (var i = 0; i < lsArray.length; i++)
			{
				var out = '<p><span>' + lsArray[i] + '</span></p>'
				Output(out);
			}
			Separator();
			Scroll();
		}
	}

	function LsRecords()
	{
		records = true;
		Separator();
		$(output).append('../<br><div class="colcont"></div>');
		for (var i = 0; i < recordsArray1.length; i++)
		{
			// console.log(recordsArray1[i]);
			var out = '<li class="col1">' + recordsArray1[i] + '</li>';
			OutputRecords(out);
		}
		$('.col1').wrapAll('<div class="col20"><ol></ol></div>');
		for (var i = 0; i < recordsArray2.length; i++)
		{
			// console.log(recordsArray2[i]);
			var out = '<li class="col2">' + recordsArray2[i] + '</li>';
			OutputRecords(out);
		}
		$('.col2').wrapAll('<div class="col20"><ol></ol></div>');
		for (var i = 0; i < recordsArray3.length; i++)
		{
			// console.log(recordsArray3[i]);
			var out = '<li class="col3">' + recordsArray3[i] + '</li>';
			OutputRecords(out);
		}
		$('.col3').wrapAll('<div class="col20"><ol></ol></div>');
		for (var i = 0; i < recordsArray4.length; i++)
		{
			// console.log(recordsArray4[i]);
			var out = '<li class="col4">' + recordsArray4[i] + '</li>';
			OutputRecords(out);
		}
		$('.col4').wrapAll('<div class="col20"><ol></ol></div>');
		for (var i = 0; i < recordsArray5.length; i++)
		{
			// console.log(recordsArray5[i]);
			var out = '<li class="col5">' + recordsArray5[i] + '</li>';
			OutputRecords(out);
		}
		$('.col5').wrapAll('<div class="col20"><ol></ol></div>');
		$(".action div span").empty().append('root@remote:~$ ');
		Separator();
		Scroll();
	}

	function Cd(data)
	{
		if (data == "cd")
		{
			var cdArray = ['- You must use the \'cd\' command with a valid directory name.'];
		}
		else if (data == 'cd records' && rt && !records && !trash)
		{
			var cdArray = [''];
			LsRecords();
		}
		else if (data == 'cd records' && !rt && !trash)
		{
			var cdArray = ['> Permission denied.'];
		}
		else if (data == 'cd records' && !rt && trash)
		{
			var cdArray = ['<p><span>- ' + inputVal + ': Directory not found.</span></p>'];
		}
		else if (data == 'cd ..')
		{
			var cdArray = [''];
			if (records)
			{
				records = false;
				$( '.colcont' ).remove();
				Ls();
			}
			else if (trash)
			{
				trash = false;
				Ls();
			}
			else
			{
				var cdArray = ['> Already at root level.']
			}
		}
		else if (data == 'cd trash' && !records && !trash)
		{
			trash = true;
			var cdArray = [''];
			Ls();
		}
		else if (data == 'cd trash' && records && !trash)
		{
			var cdArray = ['<p><span>- ' + inputVal + ': Directory not found.</span></p>'];
		}
		else
		{
			var cdArray = ['<p><span>- ' + inputVal + ': Directory not found.</span></p>'];
		}
		for (var i = 0; i < cdArray.length; i++)
		{
			var out = '<p><span>' + cdArray[i] + '</span></p>'
			Output(out);
		}
		Scroll();
	}

	function Rm(data)
	{
		if (data == 'rm')
		{
			Output('<p><span>> You must use the \'rm\' command with a valid file name.</span></p>');
			Scroll();
		}
		else if (data == 'rm records' && !records)
		{
			Output('<p><span>> Cannot remove root level files.</span></p>');
			Scroll();
		}
		else if (data == 'rm trash' && !records)
		{
			Output('<p><span>> Cannot remove root level files.</span></p>');
			Scroll();
		}
		else if (data == 'rm readme.dat' && !records)
		{
			Output('<p><span>> Cannot remove root level files.</span></p>');
			Scroll();
		}
		else if (data == 'rm a.dat' && records || data == 'rm b.dat' && records || data == 'rm c.dat' && records || data == 'rm d.dat' && records || data == 'rm e.dat' && records || data == 'rm f.dat' && records || data == 'rm g.dat' && records || data == 'rm h.dat' && records || data == 'rm i.dat' && records || data == 'rm j.dat' && records || data == 'rm k.dat' && records || data == 'rm l.dat' && records || data == 'rm m.dat' && records || data == 'rm n.dat' && records || data == 'rm o.dat' && records || data == 'rm p.dat' && records || data == 'rm q.dat' && records || data == 'rm r.dat' && records || data == 'rm s.dat' && records || data == 'rm t.dat' && records || data == 'rm u.dat' && records || data == 'rm v.dat' && records || data == 'rm w.dat' && records || data == 'rm x.dat' && records || data == 'rm y.dat' && records || data == 'rm z.dat' && records)
		{
			if (data == 'rm a.dat' || data == 'rm b.dat' || data == 'rm c.dat' || data == 'rm d.dat' || data == 'rm e.dat' || data == 'rm f.dat' || data == 'rm g.dat' || data == 'rm h.dat' || data == 'rm i.dat' || data == 'rm j.dat' || data == 'rm k.dat' || data == 'rm l.dat' || data == 'rm m.dat' || data == 'rm n.dat' || data == 'rm o.dat' || data == 'rm p.dat' || data == 'rm q.dat' || data == 'rm r.dat' || data == 'rm s.dat' || data == 'rm t.dat' || data == 'rm u.dat' || data == 'rm v.dat' || data == 'rm w.dat' || data == 'rm x.dat' || data == 'rm y.dat' || data == 'rm z.dat')
			{
				rmVal = data;
			}
			rmOK = true;
			Output('<p><span>- ' + inputVal + ': Confirm removal?</span></p>');
			$(".action div span").empty().append('Y/N: ');
			Scroll();
		}
		else
		{
			Output('<p><span>- ' + inputVal + ': File not found.</span></p>');
			Scroll();
		}
	}

	function rmSupport()
	{
		rmOK = false;
		if (rmVal == 'rm a.dat' && !a)
		{
			a = true;
			recordsArray1.splice($.inArray('a.dat', recordsArray1),1);
			rmProcess();
		}
		else if (rmVal == 'rm b.dat' && !b)
		{
			b = true;
			recordsArray1.splice($.inArray('b.dat', recordsArray1),1);
			rmProcess();
		}
		else if (rmVal == 'rm c.dat' && !c)
		{
			c = true;
			recordsArray1.splice($.inArray('c.dat', recordsArray1),1);
			rmProcess();
		}
		else if (rmVal == 'rm d.dat' && !d)
		{
			d = true;
			recordsArray1.splice($.inArray('d.dat', recordsArray1),1);
			rmProcess();
		}
		else if (rmVal == 'rm e.dat' && !e)
		{
			e = true;
			recordsArray1.splice($.inArray('e.dat', recordsArray1),1);
			rmProcess();
		}
		else if (rmVal == 'rm f.dat' && !f)
		{
			f = true;
			recordsArray1.splice($.inArray('f.dat', recordsArray1),1);
			rmProcess();
		}
		else if (rmVal == 'rm g.dat' && !g)
		{
			g = true;
			recordsArray2.splice($.inArray('g.dat', recordsArray2),1);
			rmProcess();
		}
		else if (rmVal == 'rm h.dat' && !h)
		{
			h = true;
			recordsArray2.splice($.inArray('h.dat', recordsArray2),1);
			rmProcess();
		}
		else if (rmVal == 'rm i.dat' && !i)
		{
			i = true;
			recordsArray2.splice($.inArray('i.dat', recordsArray2),1);
			rmProcess();
		}
		else if (rmVal == 'rm j.dat' && !j)
		{
			j = true;
			recordsArray2.splice($.inArray('j.dat', recordsArray2),1);
			rmProcess();
		}
		else if (rmVal == 'rm k.dat' && !k)
		{
			k = true;
			recordsArray2.splice($.inArray('k.dat', recordsArray2),1);
			rmProcess();
		}
		else if (rmVal == 'rm l.dat' && !l)
		{
			l = true;
			recordsArray2.splice($.inArray('l.dat', recordsArray2),1);
			rmProcess();
		}
		else if (rmVal == 'rm m.dat' && !m)
		{
			m = true;
			recordsArray3.splice($.inArray('m.dat', recordsArray3),1);
			rmProcess();
		}
		else if (rmVal == 'rm n.dat' && !n)
		{
			n = true;
			recordsArray3.splice($.inArray('n.dat', recordsArray3),1);
			rmProcess();
		}
		else if (rmVal == 'rm o.dat' && !o)
		{
			o = true;
			recordsArray3.splice($.inArray('o.dat', recordsArray3),1);
			rmProcess();
		}
		else if (rmVal == 'rm p.dat' && !p)
		{
			p = true;
			recordsArray3.splice($.inArray('p.dat', recordsArray3),1);
			rmProcess();
		}
		else if (rmVal == 'rm q.dat' && !q)
		{
			q = true;
			recordsArray3.splice($.inArray('q.dat', recordsArray3),1);
			rmProcess();
		}
		else if (rmVal == 'rm r.dat' && !r)
		{
			r = true;
			recordsArray3.splice($.inArray('r.dat', recordsArray3),1);
			rmProcess();
		}
		else if (rmVal == 'rm s.dat' && !s)
		{
			s = true;
			recordsArray4.splice($.inArray('s.dat', recordsArray4),1);
			rmProcess();
		}
		else if (rmVal == 'rm t.dat' && !t)
		{
			t = true;
			recordsArray4.splice($.inArray('t.dat', recordsArray4),1);
			rmProcess();
		}
		else if (rmVal == 'rm u.dat' && !u)
		{
			u = true;
			recordsArray4.splice($.inArray('u.dat', recordsArray4),1);
			rmProcess();
		}
		else if (rmVal == 'rm v.dat' && !v)
		{
			v = true;
			recordsArray4.splice($.inArray('v.dat', recordsArray4),1);
			rmProcess();
		}
		else if (rmVal == 'rm w.dat' && !w)
		{
			w = true;
			recordsArray4.splice($.inArray('w.dat', recordsArray4),1);
			rmProcess();
		}
		else if (rmVal == 'rm x.dat' && !x)
		{
			x = true;
			var rmArray = ['> Removing file [3.83TB]...'];
			console.log('########');
			console.log('Executing rmX()...');
			for (var i = 0; i < rmArray.length; i++)
			{
				var out = '<p><span>' + rmArray[i] + '</span></p>'
				Output(out);
			}
			rmX();
		}
		else if (rmVal == 'rm y.dat' && !y)
		{
			y = true;
			recordsArray5.splice($.inArray('y.dat', recordsArray5),1);
			rmProcess();			}
		else if (rmVal == 'rm z.dat' && !z)
		{
			z = true;
			recordsArray5.splice($.inArray('z.dat', recordsArray5),1);
			rmProcess();
		}
		else
		{
			Output('<p><span>- ' + inputVal + ': File not found.</span></p>');
			Scroll();
		}
	}

	function rmProcess()
	{
		var rmArray = ['> Removing file [' + (Math.floor(Math.random() * 252) + 8) + 'KB]...'];
		console.log('########');
		console.log('Executing rmOther()...');
		for (var i = 0; i < rmArray.length; i++)
		{
			var out = '<p><span>' + rmArray[i] + '</span></p>'
			Output(out);
		}
		rmOther();
	}

	function rmOther()
	{
		$('.help,.user,#userInput').hide();
		Scroll();
		Output('<p><span class="separator rm"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
		$('.rm').typeIt(
		{
			startDelay: 1000,
			speed: 12,
			lifeLike: true,
			autoStart: true,
			loop: false,
			cursor: false
		});
		setTimeout(function()
		{
			console.log('########');
			console.log(inputVal);
			$('.output').append('<p><span>- ' + inputVal + ': File removed.</span></p>');
			$('.help,.user,#userInput').show();
			Ls();
		}, 2000);
	}

	function rmX()
	{
		$('.help,.user,#userInput').hide();
		Scroll();
		Output('<p><span class="separator rm"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
		$('.rm').typeIt(
		{
			startDelay: 1000,
			speed: 300,
			lifeLike: true,
			autoStart: true,
			loop: false,
			cursor: false
		});
		rmXTimer = setTimeout(function()
		{
			console.log('########');
			console.log(inputVal);
			recordsArray4.splice($.inArray('x.dat', recordsArray4),1);
			noX = true;
			$('.output').append('<p><span>- ' + inputVal + ': File removed.</span></p>');
			$('.help,.user,#userInput').show();
			Ls();
		}, 28000);
		// Scroll();
	}

	function ReadMe()
	{
		var readmeArray = ['# README<br># ----------------<br># Note: You must login to access this database.<br># All activity will be logged.'];
		Separator();
		for (var i = 0; i < readmeArray.length; i++)
		{
			var out = '<p><span>' + readmeArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Another()
	{
		var deletedArray = ['# From: nick.yates@hmlabs.mil<br># Subject: Re: Another one...<br># Date: 9/27/2015, 2:52:18 PM PDT<br># To: admin@hmlabs.mil<br># Hey try this one: What is the opposite of "won\'t forget" but means the same thing? Haha! :-)<br># - nickyates'];
		Separator();
		for (var i = 0; i < deletedArray.length; i++)
		{
			var out = '<p><span>' + deletedArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Urgent()
	{
		var d = new Date();
		d.setHours(d.getHours() - 81)
		var deletedArray = ['# From: admin@hmlabs.mil<br># Subject: Urgent!<br># Date: ' + d.toLocaleString() + ' PDT<br># To: roxanne.insley@hmlabs.mil<br># Ms. Insley,<br># The \'Project X\' data has been encrypted.<br># Br,<br># Bob'];
		Separator();
		for (var i = 0; i < deletedArray.length; i++)
		{
			var out = '<p><span>' + deletedArray[i] + '</span></p>'
			Output(out);
		}
		Separator();
		Scroll();
	}

	function Cat(data)
	{
		if (data == 'cat')
		{
			var recordsArray = ['> You must use the \'cat\' command with a valid file name.'];
		}
		else if (inputVal == 'cat readme.dat' && !trash || inputVal == 'cat readme.dat' && !records)
		{
			var recordsArray = [''];
			ReadMe();
		}
		else if (inputVal == 'cat "readme.dat"' && !trash || inputVal == 'cat "readme.dat"' && !records)
		{
			var recordsArray = [''];
			ReadMe();
		}
		else if (inputVal == 'cat another one.eml' && trash)
		{
			var recordsArray = [''];
			Another();
		}
		else if (inputVal == 'cat "another one.eml"' && trash)
		{
			var recordsArray = [''];
			Another();
		}
		else if (inputVal == 'cat anotherone.eml' && trash)
		{
			var recordsArray = [''];
			Another();
		}
		else if (inputVal == 'cat "anotherone.eml"' && trash)
		{
			var recordsArray = [''];
			Another();
		}
		else if (inputVal == 'cat urgent.eml' && trash)
		{
			var recordsArray = [''];
			Urgent();
		}
		else if (inputVal == 'cat "urgent.eml"' && trash)
		{
			var recordsArray = [''];
			Urgent();
		}
		else if (inputVal == 'cat a.dat' && !a && records)
		{
			var recordsArray = ['# A<br># ----------------<div class="colcont"><div class="col50"># Abarough, Colby<br># Adriano, Valenka<br> # Albin, Frans<br> # Allett, Niel<br> # Almon, Talyah<br> # Amey, Chad</div><div class="col50">202-57-3728<br>664-22-4570<br>752-14-2575<br>989-00-2744<br>887-27-5224<br>741-95-8146</div></div>'];
		}
		else if (inputVal == 'cat b.dat' && !b && records)
		{
			var recordsArray = ['# B<br># ----------------<div class="colcont"><div class="col50"># Baldrick, Sean<br># Balducci, Torie<br># Bovaird, Julia<br># Brickett, Lucita<br># Burleton, Carly</div><div class="col50">249-04-1242<br>906-17-5778<br>231-17-7428<br>101-84-0962<br>495-82-7890</div></div>'];
		}
		else if (inputVal == 'cat c.dat' && !c && records)
		{
			var recordsArray = ['# C<br># ----------------<div class="colcont"><div class="col50"># Carlone, Winston<br># Chenery, Khalil<br># Chittie, Carmine<br># Clemmett, Aimee<br># Cullford, Penny</div><div class="col50">627-13-5211<br>221-15-7817<br>965-82-4986<br>222-50-7524<br>158-03-3030</div></div>'];
		}
		else if (inputVal == 'cat d.dat' && !d && records)
		{
			var recordsArray = ['# D<br># ----------------<div class="colcont"><div class="col50"># Dami, Francene<br># Davidson, Cherey<br># de la Valette, Keefe<br># Dopson, Kalinda<br># Dumingo, Vivian</div><div class="col50">995-39-1669<br>116-35-8297<br>195-24-9026<br>467-82-0477<br>293-85-1800</div></div>'];
		}
		else if (inputVal == 'cat e.dat' && !e && records)
		{
			var recordsArray = ['# E<br># ----------------<div class="colcont"><div class="col50"># Edgeworth, Jeane<br># Elvy, Gerardo</div><div class="col50">326-19-2792<br>455-42-1183</div></div>'];
		}
		else if (inputVal == 'cat f.dat' && !f && records)
		{
			var recordsArray = ['# F<br># ----------------<div class="colcont"><div class="col50"># Fallowes, Ramonda<br># Filkov, Aile<br># Frizzell, Talyah<br># Fussen, Marsh</div><div class="col50">739-26-4426<br>744-23-2467<br>662-75-2870<br>401-54-6913</div></div>'];
		}
		else if (inputVal == 'cat g.dat' && !g && records)
		{
			var recordsArray = ['# G<br># ----------------<div class="colcont"><div class="col50"># Gabotti, Thaddus<br># Geist, Chris<br># Gibbons, Ronna<br># Gossan, Brock<br># Gullivent, Bartlett<br># Gurnay, Chloe</div><div class="col50">557-05-0151<br>597-05-3547<br>951-73-0503<br>738-39-5070<br>232-88-5862<br>141-44-6310</div></div>'];
		}
		else if (inputVal == 'cat h.dat' && !h && records)
		{
			var recordsArray = ['# H<br># ----------------<div class="colcont"><div class="col50"># Hampstead, Joletta<br># Hanselmann, Blaire<br># Harden, Chlo<br># Heeps, Christina<br># Hinrich, Norine<br># Huntriss, Darwin</div><div class="col50">353-93-2248<br>366-84-9573<br>716-10-5545<br>344-78-1111<br>191-75-1261<br>613-67-2733</div></div>'];
		}
		else if (inputVal == 'cat i.dat' && !i && records)
		{
			var recordsArray = ['# I<br># ----------------<div class="colcont"><div class="col50"># Insley, Roxanne<br># Ivy, Glen</div><div class="col50">190-66-5034<br>371-99-1783</div></div>'];
		}
		else if (inputVal == 'cat j.dat' && !j && records)
		{
			var recordsArray = ['# J<br># ----------------<div class="colcont"><div class="col50"># Josef, Biddy<br># Jozsika, Laural<br># Julyan, Frank<br># Jurkiewicz, Igor</div><div class="col50">120-65-2233<br>262-00-7704<br>674-78-3318<br>116-95-2173</div></div>'];
		}
		else if (inputVal == 'cat k.dat' && !k && records)
		{
			var recordsArray = ['# K<br># ----------------<div class="colcont"><div class="col50"># Kelwaybamber, Lindy<br># Kemet, Stacee<br># Kenan, Osbert<br># Khidr, Mona<br># Knibb, Melinde<br># Kohrs, Augustine</div><div class="col50">484-96-8035<br>727-56-4877<br>613-99-9529<br>788-31-3667<br>903-00-4065<br>423-24-1262</div></div>'];
		}
		else if (inputVal == 'cat l.dat' && !l && records)
		{
			var recordsArray = ['# L<br># ----------------<div class="colcont"><div class="col50"># L\'argent, Blaine<br># Lonie, Suki<br># Lowcock, Celesta</div><div class="col50">502-82-5233<br>773-17-0387<br>143-94-1475</div></div>'];
		}
		else if (inputVal == 'cat m.dat' && !m && records)
		{
			var recordsArray = ['# M<br># ----------------<div class="colcont"><div class="col50"># MacArte, Quinn<br># Malins, Paloma<br># Matyasik, Lynnelle<br># McAllen, Alidia<br># Messer, Parry<br># Mountjoy, Joseph</div><div class="col50">920-82-7952<br>211-54-6066<br>260-68-7207<br>888-01-3773<br>281-36-9391<br>134-21-3564</div></div>'];
		}
		else if (inputVal == 'cat n.dat' && !n && records)
		{
			var recordsArray = ['# N<br># ----------------<div class="colcont"><div class="col50"># Nichols, Robert</div><div class="col50">529-17-8968</div></div>'];
		}
		else if (inputVal == 'cat o.dat' && !o && records)
		{
			var recordsArray = ['# O<br># ----------------<div class="colcont"><div class="col50"># O\'Neligan, Annalise<br># Orme, Stewart<br># Oxenford, Cheryl</div><div class="col50">433-24-9528<br>339-24-4976<br>682-48-1427</div></div>'];
		}
		else if (inputVal == 'cat p.dat' && !p && records)
		{
			var recordsArray = ['# P<br># ----------------<div class="colcont"><div class="col50"># Padell, Marian<br># Pascoe, Willdon<br># Pasley, Georges<br># Plaster, Denny<br># Pritty, Henrik</div><div class="col50">259-32-0309<br>395-95-6840<br>326-17-2711<br>890-15-3173<br>113-38-4010</div></div>'];
		}
		else if (inputVal == 'cat q.dat' && !q && records)
		{
			var recordsArray = ['# Q<br># ----------------<div class="colcont"><div class="col50"># Quenell, Cosette</div><div class="col50">263-20-9059</div></div>'];
		}
		else if (inputVal == 'cat r.dat' && !r && records)
		{
			var recordsArray = ['# R<br># ----------------<div class="colcont"><div class="col50"># Rampling, Abbye<br># Rasmus, Jermain<br># Rathke, Maren<br># Renhard, Elaina<br># Rosser, Ellene</div><div class="col50">170-81-0362<br>648-22-8583<br>902-43-6621<br>415-68-6903<br>608-67-2324</div></div>'];
		}
		else if (inputVal == 'cat s.dat' && !s && records)
		{
			var recordsArray = ['# S<br># ----------------<div class="colcont"><div class="col50"># Sanchez, Rebekah<br># Scothorn, Rodrick<br># Senechault, Henryetta<br># Silk, Emanuel<br># Snazel, Salomon<br># Sutherby, Rainer</div><div class="col50">202-57-3728<br>626-29-0900<br>675-71-4513<br>411-19-8253<br>821-41-0325<br>642-39-3754</div></div>'];
		}
		else if (inputVal == 'cat t.dat' && !t && records)
		{
			var recordsArray = ['# T<br># ----------------<div class="colcont"><div class="col50"># Tansley, Rebe<br># Thornhill, Ivey<br># Tinline, Karly<br># Truse, Filip</div><div class="col50">850-84-3347<br>540-84-0825<br>237-72-2420<br>669-73-6589</div></div>'];
		}
		else if (inputVal == 'cat u.dat' && !u && records)
		{
			var recordsArray = ['# U<br># ----------------<div class="colcont"><div class="col50"># Underwood, Joshua</div><div class="col50">208-14-2163</div></div>'];
		}
		else if (inputVal == 'cat v.dat' && !v && records)
		{
			var recordsArray = ['# V<br># ----------------<div class="colcont"><div class="col50"># Vaines, Casar<br># Van der Kruis, Fionnula<br># Van Leijs, Ailsun<br># Vannacci, Wendye<br># Veregan, Natalee</div><div class="col50">450-29-1352<br>791-79-7048<br>569-93-5151<br>447-58-7201<br>270-75-5156</div></div>'];
		}
		else if (inputVal == 'cat w.dat' && !w && records)
		{
			var recordsArray = ['# W<br># ----------------<div class="colcont"><div class="col50"># Walmsley, Michael<br># Weatherhead, Melissa<br># Whiston, Cybil<br># Witcombe, Landon</div><div class="col50">204-37-0209<br>805-71-0086<br>361-40-1119<br>467-28-8416</div></div>'];
		}
		else if (inputVal == 'cat x.dat' && !x && records)
		{
			var recordsArray = ['# SHA1 = 6667af34f26451f713ef78c1cd95bf85<br># ----------------<div class="colcont"><div class="col50"># **** ****<br># **** ****<br># **** ****<br># **** ****<br># **** ****<br># **** ****</div><div class="col50">************<br>************<br>************<br>************<br>************<br>************</div></div>'];
		}
		else if (inputVal == 'cat y.dat' && !y && records)
		{
			var recordsArray = ['# Y<br># ----------------<div class="colcont"><div class="col50"># Yarwood, Phaidra<br># Yates, Nicholas<br># Yewdale, Carolin</div><div class="col50">173-79-9321<br>558-74-7251<br>542-13-4721</div></div>'];
		}
		else if (inputVal == 'cat z.dat' && !z && records)
		{
			var recordsArray = ['# Z<br># ----------------<div class="colcont"><div class="col50"># Zelland, Adena</div><div class="col50">804-52-5893</div></div>'];
		}
		else
		{
			var recordsArray = ['<p><span>- ' + inputVal + ': File not found.</span></p>'];
		}
		// Separator();
		for (var i = 0; i < recordsArray.length; i++)
		{
			var out = '<p><span>' + recordsArray[i] + '</span></p>'
			Output(out);
		}
		// Separator();
		Scroll();
	}

	function Logout()
	{
		rt = false;
		records = false;
		var logoutArray = ['> Logged out. Root access revoked.'];
		for (var i = 0; i < logoutArray.length; i++)
		{
			var out = '<p><span>' + logoutArray[i] + '</span></p>'
			Output(out);
			$(".action div span").empty().append('usr@remote:~$ ');
		}
		Scroll();
	}

	function UnknownCommand()
	{
		if (!pw && !rt || rt)
		{
			Output('<p><span>- ' + inputVal + ': Command not found.</span></p>');
		}
		else if (pw)
		{
			Output('<p><span>- Incorrect password.</span></p><p><span>- Password hint?</span></p>');
		}
		// input.text('');
		input.removeClass('password');
		if (pw && !rt)
		{
			$(".action div span").empty().append('Y/N: ');
			// input.focus();
		}
		Scroll();
	}

	function ExitSystem()
	{
		if (!rt)
		{
			if (noX)
			{
				output.html('');
				if (!localStorage.getItem('gameOver'))
				{
					var now = $.now(); // First time on page
					localStorage.setItem('gameOver', now,
					{
						expires: 7,
						path: '/'
					});
					Output('<p class="processing">Exiting system. Please wait...</p>');
					$('.help,.user,#userInput').remove();
					Output('<p><span class="separator exit"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
					$('.exit').typeIt(
					{
						startDelay: 1000,
						speed: 30,
						lifeLike: true,
						autoStart: true,
						loop: false,
						cursor: false
					});
					setTimeout(function()
					{
						$('#cd').countdown('destroy');
						$('#cd').remove();
						console.log('########');
						console.log('System exited.');
						$('.init1').remove();
						$('.output').empty();
						$('.output').append('<p><span>- System not found. Please reinstall.</span></p>');
						Success();
					}, 4000);
				}
				else {
					$('.init1').remove();
					$('.output').append('<p><span>- System not found. Please reinstall.</span></p>');
					Success();
				}
			}
			else
			{
				output.html('');
				Output('<p class="processing">Exiting system. Please wait...</p>');
				$('.help,.user,#userInput').remove();
				Output('<p><span class="separator exit"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
				$('.exit').typeIt(
				{
					startDelay: 1000,
					speed: 30,
					lifeLike: true,
					autoStart: true,
					loop: false,
					cursor: false
				});
				setTimeout(function()
				{
					$('#cd').remove();
					console.log('########');
					console.log('System exited.');
					$('.processing,.exit').remove();
					$('.output').append('<p><span>- Refresh WWW browser reboot portal.</span></p>');
				}, 4000);
			}
		}
		else
		{
			Output('<p><span>> You must logout before exiting the system.<span></p>');
			Scroll();
		}
	}

	function OutOfTime()
	{
		console.log('Stop rmXTimer.');
		clearTimeout(rmXTimer);
		output.html('');
		$( '#cd' ).remove();
		Output('<p class="processing">Automatic backup initiated. Logging out...</p>');
		$('.help,.user,#userInput').remove();
		Output('<p><span class="separator exit"># # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #</span></p>');
		$('.exit').typeIt(
		{
			startDelay: 1000,
			speed: 30,
			lifeLike: true,
			autoStart: true,
			loop: false,
			cursor: false
		});
		setTimeout(function()
		{
			console.log('########');
			console.log('System exited.');
			$('.processing,.exit').remove();
			Output('<p><span>- Last access log: </span></p>');
			// Get key from GitHub Secrets
			$.getJSON('hthttps://api.ipgeolocation.io/ipgeo?apiKey=SECRETKEY', function(data) {
			$('.output').append('> ' + JSON.stringify(data, null, 2));
			});
			// Get key from GitHub Secrets
			$.getJSON('https://api.ipgeolocation.io/ipgeo?apiKey=SECRETKEY&fields=country_code3,state_prov,city,zipcode,latitude,longitude,time_zone')
			.done(function(data) {
				const currentDate = data.time_zone.current_time.split(' ')[0];  // Date in YYYY-MM-DD
				const currentTime = data.time_zone.current_time.split(' ')[1].substring(0, 8);  // Time in HH:MM:SS
        
				const output = `
					<p><span>- Last access log: </span></p>	
					<p><strong>Date/Time:</strong> ${currentDate} / ${currentTime}<br/>
					<strong>Location:</strong> ${data.city}, ${data.state_prov} ${data.zipcode} ${data.country_code3}<br/>
					<strong>Latitude/Longitude:</strong> ${data.latitude} / ${data.longitude}</p>
				`;
        
				$('.output').html(output);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error("Request failed: " + textStatus + ", " + errorThrown);
		});
		Failure();
		}, 4000);
	}

	function Success()
	{
		setTimeout(function()
		{
			console.log('########');
			console.log('Please wait...');
			$('.output').append('<p class="processing"><span>- Please wait...</span></p>');
			setTimeout(function()
			{
				console.log('########');
				console.log('Transferring...');
				window.open ('../success.html','_self',false);
			}, 8000);
		}, 2000);
	}
	function Failure()
	{
		setTimeout(function()
		{
			console.log('########');
			console.log('Please wait...');
			$('.output').append('<p class="processing"><span>- Please wait...</span></p>');
			setTimeout(function()
			{
				console.log('########');
				console.log('Transferring...');
				window.open ('../failure.html','_self',false);
			}, 8000);
		}, 2000);
	}
});