import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';

class PassengerHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      routes: {
        "/": (_) => new WebviewScaffold(
              url: "http://34.92.204.154:3000/map?phone=93145493",
              appBar: new AppBar(
                title: new Text("Widget webview"),
              ),
            ),
      },
    );
  }
}
