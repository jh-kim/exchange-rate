

# Exchangerate


## Synopsis

The Simple Currency conversion

The source of exchange rates is [http://www.fxexchangerate.com](http://www.fxexchangerate.com)

## Example

/api/xchange?from=[code of source country(required)]&to=[code of destination country]&amount=[amount of source country]

code of country(144 countries) is [countries.json](https://github.com/jh-kim/exchange-rate/blob/master/app/countries.json)

* 10USD to JPY
http://depository.pe.kr:8080/api/xchange?from=usd&to=jpy&amount=10

* 1USD to All Countries
http://depository.pe.kr:8080/api/xchange?from=usd

* 100USD to All Countries
http://depository.pe.kr:8080/api/xchange?from=usd&amount=100

