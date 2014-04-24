@echo off
java -jar ..\..\tool\yuicompressor-2.4.8.jar %1 > %2
echo %1 minified.