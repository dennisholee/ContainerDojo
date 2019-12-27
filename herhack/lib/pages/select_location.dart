import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:place_picker/place_picker.dart';

import 'dart:async';

class DriverHomePagestateful extends StatefulWidget {

  DriverHomePagestateful();

  @override
  State<StatefulWidget> createState() => PickerDemoState();
}

class PickerDemoState extends State<DriverHomePagestateful> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hi, driver ')),
      body: Center(
        child: FlatButton(
          child: Text("Pick Delivery location"),
          onPressed: () {
            showPlacePicker();
          },
        ),
      ),
    );
  }

  void showPlacePicker() async {
    LocationResult result = await Navigator.of(context).push(MaterialPageRoute(
        builder: (context) =>
            PlacePicker("AIzaSyC0EsZ7_4Qxz9P19Krz5i5cM6Xe6fZ6O38")));

    // Handle the result in your way
    print(result.latLng);
  }
}
