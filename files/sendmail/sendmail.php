<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	require 'phpmailer/src/SMTP.php';

 
	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	/*
	$mail->isSMTP();                                            //Send using SMTP
	$mail->Host       = 'smtp.example.com';                     //Set the SMTP server to send through
	$mail->SMTPAuth   = true;                                   //Enable SMTP authentication
	$mail->Username   = 'user@example.com';                     //SMTP username
	$mail->Password   = 'secret';                               //SMTP password
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
	$mail->Port       = 465;                 
	*/

	//Від кого лист
	$mail->setFrom('Brevko@gmail.com', 'Brevko'); // Вказати потрібний E-mail
	//Кому відправити
	$mail->addAddress('denis.hrudin@gmail.com'); // Вказати потрібний E-mail
	//Тема листа
	$mail->Subject = 'Заявка з сайту Brevko';

		/* 	З якох сторінки відправленно форму */
	$page_url = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'URL не визначено';

	// Створити текст повідомлення з URL сторінки
	$urlPage = "зі сторінки: " .'<a href="'.$page_url.'">$page_url</a>';
	//Тіло листа
	$body = '<h1>Заявка з сайту Brevko '.$urlPage.'</h1>';
	


	if(trim(!empty($_POST['monument']))){
			//Який памʼятник вас цікавить?
			$monument = "Одинарний";
			if(isset($_POST['monument'])){
				if($_POST['monument'] == "double"){
					$monument = "Подвійний";
				}
				elseif($_POST['monument'] == "burial"){
					$monument = "Під захоронення";
				}
				elseif($_POST['monument'] == "warrior"){
					$monument = "Для воїна";
				}
				elseif($_POST['monument'] == "children"){
					$monument = "Дитячі";
				}
				elseif($_POST['monument'] == "combined"){
					$monument = "Комбінований крихта-граніт";
				}
			}
		$body.='<p><strong>Який памʼятник вас цікавить?</strong> '.$monument.'</p>';

	}

	if(trim(!empty($_POST['base']))){
			    /* Яка основа під пам'ятник? */
				$base = "Залитий бетон";
				if($_POST['base'] == "beam"){
					$base = "Бетон на бетонних балках";
				}
				
		$body.='<p><strong>Яка основа під пам\'ятник?</strong> '.$base.'</p>';
	}

	if(trim(!empty($_POST['design']))){

		    	//Яке художнє оформлення ви бажаєте?
				$design = "Фото з керамікою";
				if(isset($_POST['design'])){
					if($_POST['design'] == "gray-print"){
						$design = "Сірий друк на плиті";
					}
					elseif($_POST['design'] == "glass"){
						$design = "Фото скло";
					}
				}
		
		$body.='<p><strong>Яке художнє оформлення ви бажаєте?</strong> '.$design.'</p>';
	}

	if(trim(!empty($_POST['podpys']))){
				     //Яке оформлення підпису ви бажаєте?
					 $podpys = "Латинські букви";
					 if($_POST['podpys'] == "grey"){
						$podpys = "Сірий друк на плиті";
					}
		$body.='<p><strong>Яке оформлення підпису ви бажаєте?</strong> '.$podpys.'</p>';
	}

	if(trim(!empty($_POST['dostavka']))){
		     //Чи потрібна доставка та встановлення? 
			 $dostavka = "Так";
			 if($_POST['dostavka'] == "ni"){
				$dostavka = "Ні";
			}
		$body.='<p><strong>Чи потрібна доставка та встановлення?</strong> '.$dostavka.'</p>';
	}

	if(trim(!empty($_POST['misto']))){
		$misto = $_POST['misto'];
		$body.='<p><strong>Місто або село: </strong> '.$misto.'</p>';
	}

	if(trim(!empty($_POST['installation']))){
				     //Чи бажаєте, щоб ми встановили пам'ятник?
					 $installation = "Так";
					 if($_POST['dostavka'] == "no"){
						$installation = "Ні";
					}
		$body.='<p><strong>Чи бажаєте, щоб ми встановили пам\'ятник?</strong> '.$installation.'</p>';
	}

	if(trim(!empty($_POST['name']))){
		$name = $_POST['name'];
		$body.='<p><strong>Імя:</strong> '.$name .'</p>';
	}
	
	if(trim(!empty($_POST['phone']))){
		$phone = $_POST['phone'];
		$body.='<p><strong>Телефон:</strong> '.$phone.'</p>';
	}

	if(trim(!empty($_POST['location']))){
	 	$location = $_POST['location'];
		$body.='<p><strong>Місцезнаходження:</strong> '.$_POST['location'].'</p>';
	}

	if(trim(!empty($_POST['email']))){
		$email = $_POST['email'];
		$body.='<p><strong>Емейл:</strong> '.$email.'</p>';
	}
	 
	if($referrer){
		$body.='<p><strong>З якої сторінки відправленна форма:</strong> '.$referrer.'</p>';
	}

	$mail->Body = $body;

	//Відправляємо
	if (!$mail->send()) {
		$message = 'Помилка';
	
	} else {
		$message = 'Дані надіслані!';
		header("Location: /thank-calc.html");
		$_POST = array();
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);


 	//Тіло листа телеграм
	$bodyTelegram = [];

		//В переменную $token нужно вставить токен, который нам прислал @botFather
	$token = "5866722845:AAH9ym8CizXawsPeEwE1Ce-WMHGO9fnDwmQ";

	//Сюда вставляем chat_id
	$chat_id = "-1001466676570";

	//Определяем переменные для передачи данных из нашей формы
 

	//Собираем в массив то, что будет передаваться боту
/* 	$bodyTelegram = array(
		'Який памʼятник вас цікавить?' => isset($monument) ? $monument : '',
		'Яка основа під пам\'ятник?' => isset($base) ? $base : '',
		'Яке художнє оформлення ви бажаєте?' => isset($design) ? $design : '',
		'Яке оформлення підпису ви бажаєте?' => isset($podpys) ? $podpys : '',
		'Чи потрібна доставка та встановлення?' => isset($dostavka) ? $dostavka : '',
		'Місто або село:' => isset($misto) ? $misto : '',
		'Чи бажаєте, щоб ми встановили пам\'ятник?' => isset($installation) ? $installation : '',
		'Імя:' => isset($name) ? $name : '',
		'Телефон:' => isset($phone) ? $phone : '',
		'Місцезнаходження:' => isset($location) ? $location : '',
		'Емейл:' => isset($email) ? $email : '',
	); */
	$bodyTelegram = array();



	if (isset($monument)) {
		$bodyTelegram['Який памʼятник вас цікавить?'] = $monument;
	}
	if (isset($base)) {
		$bodyTelegram['Яка основа під пам\'ятник?'] = $base;
	}
	if (isset($design)) {
		$bodyTelegram['Яке художнє оформлення ви бажаєте?'] = $design;
	}
	if (isset($podpys)) {
		$bodyTelegram['Яке оформлення підпису ви бажаєте?'] = $podpys;
	}
	if (isset($dostavka)) {
		$bodyTelegram['Чи потрібна доставка та встановлення?'] = $dostavka;
	}
	if (isset($misto)) {
		$bodyTelegram['Місто або село:'] = $misto;
	}
	if (isset($installation)) {
		$bodyTelegram['Чи бажаєте, щоб ми встановили пам\'ятник?'] = $installation;
	}
	if (isset($name)) {
		$bodyTelegram['Імя:'] = $name;
	}
	if (isset($phone)) {
		$bodyTelegram['Телефон:'] = $phone;
	}
	if (isset($location)) {
		$bodyTelegram['Місцезнаходження:'] = $location;
	}
	if (isset($email)) {
		$bodyTelegram['Емейл:'] = $email;
	}
	//Настраиваем внешний вид сообщения в телеграме

	foreach($bodyTelegram as $key => $value) {
	        $txt .= "<b>".$key."</b> ".$value."%0A";
	    };
		$url = $page_url;
		$text = $page_url;
		$link = '<a href="' . $url . '">' . $text . '</a>';
		$sendText = "<b>".'Заявка з сайту Brevko'."</b>"."%0A"."%0A"."<b>".'Зі сторінки: '."</b>"."<a>".$link."</a>"."%0A"."%0A".$txt;


		//Передаем данные боту
	    $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$sendText}","r");

		//Выводим сообщение об успешной отправке
	    if ($sendToTelegram) {
	        alert('Дякую! Вашу заявку прийнято. Ми зв\'яжемося з вами найближчим часом.');
	    }

		//А здесь сообщение об ошибке при отправке
	    else {
	        alert('Щось пішло не так. Спробуйте надіслати форму ще раз.');
	    }
	 
	?>