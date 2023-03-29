<?php
// using and DB class that we got from the bootcamp
require_once 'DB.php';
// connecting to the database i created for the words in mysql
DB::connect('127.0.0.1', 'ic-group-words', 'root', '');

// accesssing the data sent from the frontend 
$assing_data = file_get_contents('php://input');
// decoding the data to obj format
$assing_data = json_decode($assing_data);
// accessing only the word
$insert_word = $assing_data->searched_word;

// die();

// inserting the word into the database
DB::insert("
INSERT INTO 
`searched_words` 
(`word`) 
VALUES 
('{$insert_word}');");

// selecting all the words from the database
$words = DB::select('SELECT * FROM `searched_words` WHERE 1');

// creating a new array from the searched words from the database
$searched_words = [];

foreach ($words as $word) {
    array_push($searched_words, $word->word);
};

// reducing the array of all words from the database and adding 
//a count to how many times they appear in the database
$counted_words = [];
foreach ($searched_words as $word) {
    if (isset($counted_words[$word])) {
        $counted_words[$word]++;
    } else {
        $counted_words[$word] = 1;
    }
}
// sorting them from the biggest to the lowest count
arsort($counted_words);
$counted_words = json_encode($counted_words);
print_r($counted_words);
// var_dump($found_word);
