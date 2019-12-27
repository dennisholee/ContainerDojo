import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:herhack/pages/passenger_home.dart';
import 'package:place_picker/place_picker.dart';
import 'package:http/http.dart' as http;

class DriverHomePage extends StatelessWidget {
  final String userName = "Jeffrey";
  final String phoneNum;

  final fromController = TextEditingController();
  final toController = TextEditingController();
  final carPlateController = TextEditingController();
  final capacityController = TextEditingController();

  LatLng from;
  LatLng to;

  DriverHomePage(this.phoneNum);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Hello, driver ' + userName),
        ),
        body: Container(
          padding: EdgeInsets.all(30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              TextFormField(
                  controller: fromController,
                  style: TextStyle(color: Colors.black),
                  onTap: () {
                    showFromPlacePicker(context);
                  },
                  obscureText: false,
                  decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)),
                      labelText: "FROM",
                      labelStyle: TextStyle(color: Colors.black54),
                      focusedBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)))),
              SizedBox(
                height: 10.0,
              ),
              TextFormField(
                  controller: toController,
                  style: TextStyle(color: Colors.black),
                  onTap: () {
                    showToPlacePicker(context);
                  },
                  obscureText: false,
                  decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)),
                      labelText: "TO",
                      labelStyle: TextStyle(color: Colors.black54),
                      focusedBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)))),
              SizedBox(
                height: 10.0,
              ),
              TextFormField(
                  controller: carPlateController,
                  style: TextStyle(color: Colors.black),
                  obscureText: false,
                  decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)),
                      labelText: "CAR PLATE",
                      labelStyle: TextStyle(color: Colors.black54),
                      focusedBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)))),
              SizedBox(
                height: 10.0,
              ),
              TextFormField(
                  controller: capacityController,
                  style: TextStyle(color: Colors.black),
                  obscureText: false,
                  decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)),
                      labelText: "CAPACITY",
                      labelStyle: TextStyle(color: Colors.black54),
                      focusedBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.black54, width: 1)))),
              SizedBox(
                height: 10.0,
              ),
              Container(
                height: 50,
                child: FlatButton(
                  color: Colors.red,
                  textColor: Colors.white,
                  child: Text('Create Trip'),
                  onPressed: () {
                    updateDriverInfo();
                    Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                            builder: (context) => PassengerHomePage()));
                  },
                ),
              )
            ],
          ),
        ));
  }

  void showFromPlacePicker(context) async {
    LocationResult result = await Navigator.of(context).push(MaterialPageRoute(
        builder: (context) =>
            PlacePicker("AIzaSyC0EsZ7_4Qxz9P19Krz5i5cM6Xe6fZ6O38")));

    // Handle the result in your way
    from = result.latLng;
    fromController.value = TextEditingValue(text: result.name);
  }

  void showToPlacePicker(context) async {
    LocationResult result = await Navigator.of(context).push(MaterialPageRoute(
        builder: (context) =>
            PlacePicker("AIzaSyC0EsZ7_4Qxz9P19Krz5i5cM6Xe6fZ6O38")));

    // Handle the result in your way
    to = result.latLng;
    toController.value = TextEditingValue(text: result.name);
  }

  void updateDriverInfo() async {
    var url = 'http://34.92.144.247:5000/user';
    Map map = {
      "email": "jeffrey@gmail.com",
      "lag": from.latitude.toString(),
      "lng": from.longitude.toString(),
      "pass1": "66189831",
      "pass2": "60220215",
      "pass3": "97259741",
      "pass4": null,
      "pass5": null,
      "phone": phoneNum,
      "points": 100,
      "username": "Jeffrey"
    };
    var body = json.encode(map);
    var response = await http.post(url,
        headers: {"Content-Type": "application/json"}, body: body);
  }
}
