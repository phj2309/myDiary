function openDB1() {
	db = window.openDatabase('diaryDB', '1.0', '일기장DB', 1024 * 1024);
	console.log('1_DB 생성...');
}

// 테이블 생성 트랜잭션 실행
function createTable1() {
	db.transaction(function(tr) {
		var createSQL = 'create table if not exists profile(name varchar(20), age varchar(20), address varchar(100), phone varchar(30), password varchar(30))';

		tr.executeSql(createSQL, [], function() {
			console.log('2_1_테이블생성_sql 실행 성공...');
		}, function() {
			console.log('2_1_테이블생성_sql 실행 실패...');
		});
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 성공...');
	});
}

function deleteProfile() {
	db.transaction(function(tr) {
		var deleteSQL = 'delete from profile';
		tr.executeSql(deleteSQL, [], function(tr, rs) {
			console.log('데이터 삭제');
		});
	});
}

function insertProfile() {
	db.transaction(function(tr) {
		var name = $('#name1').val();
		var age = $('#age1').val();
		var address = $('#address1').val();
		var phone = $('#phone1').val();
		var password = $('#pw1').val();
		var insertSQL = 'insert into profile(name, age, address, phone, password) values(?, ?, ?, ?, ?)';
		tr.executeSql(insertSQL, [name, age, address, phone, password], function(tr, rs) {
			console.log('3_ 프로필 등록...no: ' + rs.insertId);
			alert('프로필 ' + $('#name1').val() + ' 이 입력되었습니다');
			$('#name1').val('');
			$('#age1').val('');
			$('#address1').val('');
			$('#phone1').val('');
			$('#pw1').val('');
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}

function updateProfile() {
	db.transaction(function(tr) {
		var new_name = $('#name2').val();
		var new_age = $('#age2').val();
		var new_address = $('#address2').val();
		var new_phone = $('#phone2').val();
		var new_password = $('#pw2').val();
		var old_name = varName;
		var updateSQL = 'update profile set name = ?, age = ?, address = ?, phone = ?, password = ?where name = ?';
		tr.executeSql(updateSQL, [new_name, new_age, new_address, new_phone, new_password, old_name], function(tr, rs) {
			console.log('5_프로필 수정.... ');
			alert('프로필 ' + varName + ' 이(가) 수정되었습니다');
			$('#name1').val('');
			$('#age1').val('');
			$('#address1').val('');
			$('#phone1').val('');
			$('#password').val('');
		}, function() {
			alert('맛집명 ' + $('#cafeName1').val() + ' 이(가) 수정 실패하였습니다');
		});
	});
}

function displayProfile() {
	db.transaction(function(tr) {
		var len,
		    i,
		    age = "",
		    address = "",
		    phone = "";
		var tagList = '';
		var sname = $('#name1').val();
		var selectSQL = 'select * from profile';
		tr.executeSql(selectSQL, [], function(tr, rs) {
			console.log('프로필 가져오기');
			recordSet = rs;
			tagList += '<p><i class="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i>' + rs.rows.item(0).name + '</p>';
			tagList += '<p><i class="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i>' + rs.rows.item(0).age + '</p>';
			tagList += '<p><i class="fa fa-home fa-fw w3-margin-right w3-text-theme"></i>' + rs.rows.item(0).address + '</p>';
			tagList += '<p><i class="fa fa-phone fa-fw w3-margin-right w3-text-theme"></i>' + rs.rows.item(0).phone + '</p>';

			$('#profileInfoArea').html(tagList);
			$.mobile.changePage("#profilePanel", "slide", false, true);
		});
	});

}

function getPic() {
	var myName = recordSet.rows.item(varPosition).name;
	var myPic = recordSet.rows.item(varPosition).pic;
	$('#picName').text(myName);
	$('#picArea').attr('src', myPic);
	$.mobile.changePage("#picShowDialog", "pop", false, true);
}

