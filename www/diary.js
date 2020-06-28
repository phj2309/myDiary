function openDB() {
   db = window.openDatabase('diaryDB', '1.0', '일기장DB', 1024 * 1024);
   console.log('1_DB 생성...');
}

// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr) {
      var createSQL = 'create table if not exists diary(id integer primary key autoincrement, diaryName varchar(20) not null unique, content varchar(500), weather varchar(10), date varchar(20), pic varchar(50))';

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

// 데이터 입력 트랜잭션 실행
function insertDiary() {
   db.transaction(function(tr) {
      var name = $('#diaryName').val();
      var date = $('#diaryDate').val();
      var weather = $('#diaryWeather').val();
      var content = $('#diaryMemo').val();
      var pic = $('#diaryPic1').val();
      var insertSQL = 'insert into diary(diaryName, content, weather, date, pic) values(?,?,?,?,?)';
      tr.executeSql(insertSQL, [name, content, weather, date, pic], function(tr, rs) {
         console.log('3_ 일기장 등록...no: ' + rs.insertId);
         alert('일기 ' + $('#diaryName').val() + ' 이(가) 입력되었습니다');
         $('#diaryWeather').val('미정').attr('selected', 'selected');
         $('#diaryWeather').selectmenu('refresh');
         $('#diaryName').val('');
         $('#diaryDate').val('');
         $('#diaryMemo').val('');
         //form1.reset();
      }, function(tr, err) {
         alert('DB오류 ' + err.message + err.code);
      });
   });
}

// 데이터 수정 트랜잭션 실행
function updateDiary(name) {
   db.transaction(function(tr) {
      var new_name = $('#diaryName2').val();
      var new_weather = $('#diaryWeather2').val();
      var new_memo = $('#diaryMemo2').val();
      var new_pic = $('#diaryPic2').val();
      var new_date = $('#diaryDate2').val();
      var old_name = name;
      var updateSQL = 'update diary set diaryName = ?, weather = ?, content = ?, date = ?, pic = ? where diaryName = ?';
      tr.executeSql(updateSQL, [new_name, new_weather, new_memo, new_date, new_pic, old_name], function(tr, rs) {
         console.log('5_일기 수정.... ');
         alert('제목 ' + varDiaryName + ' 이(가) 수정되었습니다');
         $('#diaryWeather2').val('미정').attr('selected', 'selected');
         $('#diaryWeather2').selectmenu('refresh');
         form2.reset();
      }, function() {
         alert('제목 ' + $('#diaryName1').val() + ' 이(가) 수정 실패하였습니다');
      });
   });
}

// 데이터 삭제 트랜잭션 실행
function deleteDiary(name) {
   db.transaction(function(tr) {
      var deleteSQL = 'delete from diary where diaryName = ?';
      tr.executeSql(deleteSQL, [name], function(tr, rs) {
         console.log('6_일기 삭제... ');
         alert('일기 ' + varDiaryName + ' 이(가) 삭제되었습니다');
         $('#diaryType2').val('미정').attr('selected', 'selected');
         $('#diaryType2').selectmenu('refresh');
         //form2.reset();
      }, function() {
         alert('일기 ' + $('#diaryName1').val() + ' 이(가) 삭제 실패하였습니다');
      });
   });
}

// 사진 촬영 검색
function getPhoto() {
   navigator.camera.getPicture(onPhotoURISuccess, onFail, {
      quality : 50,
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY
   });
}

// 사진검색 성공콜백함수
function onPhotoURISuccess(imageURI) {
   $('#displayArea').attr('src', imageURI);
   $('h3').replaceWith($('<h3>불러온 사진</h3>'));
}

// 사진촬영/검색 실패콜백함수
function onFail(message) {
   alert('실패 : ' + message);
}

// 데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectDiaryModify(name) {
   db.transaction(function(tr) {
      var selectSQL = 'select diaryName, weather, content, date, pic from diary where diaryName=?';
      tr.executeSql(selectSQL, [name], function(tr, rs) {
         $('#diaryName2').val(rs.rows.item(0).diaryName);
         $('#diaryWeather2').val(rs.rows.item(0).weather).attr('selected', 'selected');
         $('#diaryMemo2').val(rs.rows.item(0).content);
         $('#diaryPic2').val(rs.rows.item(0).pic);
         $('#diaryDate2').val(rs.rows.item(0).date);

      });
   });
}

function allList() {// 제목만 나오는 리스트. 링크걸면 상세내용이 뜨는것도 좋을거같음
   db.transaction(function(tr) {
      var i,
          count,
          tagList = '';
      var selectSQL = 'select diaryName, content, weather, pic, date from diary';

      tr.executeSql(selectSQL, [], function(tr, rs) {
         count = rs.rows.length;
         if (count > 0) {
            for ( i = 0; i < count; i += 1) {
               tagList += '<div class="w3-container w3-card w3-white w3-round w3-margin"><br>';
               //tagList += '<img src="/w3images/avatar2.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">';
               tagList += '<span class="w3-right w3-opacity">' + rs.rows.item(i).date + '</span>';
               tagList += '<h4>' + rs.rows.item(i).diaryName + '</h4><br>';
               tagList += '<p>' + rs.rows.item(i).weather + '</p>';
               tagList += '</div>';
            }
            $('#diaryListArea').html(tagList);
            $('#diaryListArea').listview().listview('refresh');
         } else {
            console.log('실패');
            alert('검색 결과 없음(제목만)', null, '다이어리 검색 실패(제목만)');
         }
      });
   });
}

// 카페 목록 동적 구성을 위한 데이터 검색 트랜잭션 실행
function selectDiaryList() {
   db.transaction(function(tr) {
      var i,
          count,
          tagList = '';

      var ct = $('#search').val();
      console.log(ct);
      var sType = $('#diaryType3').val();
      console.log(sType);
      var selectSQL = '';

      if (ct == "title") {
         selectSQL = 'select diaryName, content, weather, pic, date from diary where diaryName like ?';
      } else if (ct == "content") {
         selectSQL = 'select diaryName, content, weather, pic, date from diary where content like ?';
      } else if (ct == "date") {
         selectSQL = 'select diaryName, content, weather, pic, date from diary where date=?';
      } else if (ct == "weather") {
         selectSQL = 'select diaryName, content, weather, pic, date from diary where weather=?';
      }

      tr.executeSql(selectSQL, [sType], function(tr, rs) {
         console.log(' 일기 검색중... ' + rs.rows.length + '건.');
         recordSet = rs;
         count = rs.rows.length;

         if (count > 0) {
            for ( i = 0; i < count; i += 1) {
               tagList += '<div class="w3-container w3-card w3-white w3-round w3-margin"><br>';
               //tagList += '<img src="/w3images/avatar2.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">';
               tagList += '<span class="w3-right w3-opacity">' + rs.rows.item(i).date + '</span>';
               tagList += '<h4>' + rs.rows.item(i).diaryName + '</h4><br>';
               tagList += '<p>' + rs.rows.item(i).weather + '</p>';
               tagList += '<hr class="w3-clear">';
               tagList += '<p>' + rs.rows.item(i).content + '</p>';
               tagList += '<div class="w3-row-padding" style="margin:0 -16px">';
               tagList += '<div class="w3-full">';
               tagList += '<img src="' + rs.rows.item(i).pic +'" style="width:100%" alt="Northern Lights" class="w3-margin-bottom">';
               tagList += '</div>';
               //tagList += '<div class="w3-half">';
               //tagList += '<img src="/w3images/nature.jpg" style="width:100%" alt="Nature" class="w3-margin-bottom">';
               //tagList += '</div>';
               tagList += '</div>';
               //tagList += '<button type="button" class="w3-button w3-theme-d1 w3-margin-bottom" id="updatePage">수정</button>';
               //tagList += '<button type="button" class="w3-button w3-theme-d2 w3-margin-bottom" id="btnDelete">삭제</button>';
               tagList += '</div>';
            }
            $('#diaryListArea').html(tagList);
            $('#diaryListArea').listview().listview('refresh');
         } else {
            console.log('실패');
            alert('검색 결과 없음', null, '다이어리 검색 실패');
         }

      });
   });
}

// 맛집 상세 정보 표시
function displayDiaryInfo(index) {
   var len,
       i,
       name = "",
       type = "",
       score = "",
       region = "",
       phone = "",
       address = "",
       memo = "",
       pic = "";

   // 맛집 상세 정보를 설정
   var myDiaryRecord = recordSet.rows.item(index);
   varPosition = index;

   if (myDiaryRecord.name != null) {// 맛집 이름
      name = '<div class="ui-bar ui-bar-a"><h3>' + myDiaryRecord.name + '</h3></div>';
   } else {
      name = '<p>이름 : 정보없음</p>';
   }
   if (myDiaryRecord.name != null) {
      type = '<p>유형 : ' + myDiaryRecord.type + '</p>';
   } else {
      type = '<p>유형 : 정보없음</p>';
   }
   if (myDiaryRecord.memo != null) {
      memo = '<p>내용 : ' + myDiaryRecord.memo + '</p>';
   } else {
      memo = '<p>내용 : 정보없음</p>';
   }
   if (myDiaryRecord.pic != null) {
      pic = '<p>사진 : ' + myDiaryRecord.region + '</p>';
   } else {
      pic = '<p>사진 : 정보없음</p>';
   }
   if (myDiaryrecord.phone != null) {// 전화번호
      weather = '<p>날씨 : ' + myDiaryRecord.weather + '</p>';
   } else {
      weather = '<p>날씨 : 정보없음</p>';
   }
   $('#diaryInfoArea').html(name + type + memo + pic + weather);
   $.mobile.changePage("#DiaryInfoShowPage", "slide", false, true);
}
